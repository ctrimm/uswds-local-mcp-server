# USWDS Coding Agent: Technical Implementation Guide

**Complete step-by-step instructions with executable code**

---

## Prerequisites Checklist

- [ ] Ubuntu 20.04+ or macOS (WSL2 for Windows)
- [ ] NVIDIA GPU with 16GB+ VRAM (RTX 4090, A100, or similar)
- [ ] 64GB+ System RAM recommended
- [ ] 200GB+ free disk space
- [ ] Python 3.10 or 3.11
- [ ] CUDA 12.1+ installed
- [ ] Git installed

---

## Phase 1: Environment Setup

### Step 1.1: Verify GPU and Install Drivers

```bash
# Check GPU
nvidia-smi

# If driver missing (Ubuntu):
sudo apt update
sudo apt install ubuntu-drivers-common
sudo ubuntu-drivers autoinstall
sudo reboot

# Verify CUDA version (should be 12.1+)
nvcc --version
```

**Checkpoint:** `nvidia-smi` shows your GPU with CUDA 12.1+
- [ ] GPU detected and working
- [ ] CUDA installed and functioning

### Step 1.2: Install OLLAMA

```bash
# Install OLLAMA
curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version

# Test with a small model
ollama pull qwen2.5-coder:7b

# Test generation
ollama run qwen2.5-coder:7b "Write a hello world function in Python"
```

**Checkpoint:** OLLAMA generates a Python function
- [ ] OLLAMA installed successfully
- [ ] Test model runs correctly

### Step 1.3: Create Python Environment

```bash
# Using conda (recommended)
conda create -n uswds-agent python=3.10 -y
conda activate uswds-agent

# Or using venv
python3.10 -m venv uswds-agent
source uswds-agent/bin/activate  # Linux/Mac
# uswds-agent\Scripts\activate  # Windows
```

**Checkpoint:** Python environment activated
- [ ] Environment created
- [ ] Environment activated

### Step 1.4: Install Fine-tuning Dependencies

```bash
# Install Unsloth and dependencies
pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
pip install --no-deps trl peft accelerate bitsandbytes

# Install additional tools
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install transformers datasets wandb huggingface_hub
pip install llama-cpp-python

# Verify installation
python -c "import unsloth; print('Unsloth installed successfully')"
python -c "import torch; print(f'PyTorch: {torch.__version__}, CUDA: {torch.cuda.is_available()}')"
```

**Checkpoint:** All packages installed without errors
- [ ] Unsloth installed
- [ ] PyTorch with CUDA support verified
- [ ] No installation errors

### Step 1.5: Install Synthetic Data Kit

```bash
# Install vLLM for serving models
pip install vllm

# Install synthetic-data-kit
pip install synthetic-data-kit

# Install additional dependencies
pip install pdfminer.six beautifulsoup4 python-docx python-pptx

# Verify installation
synthetic-data-kit --help
```

**Checkpoint:** Synthetic data kit help text displays
- [ ] synthetic-data-kit installed
- [ ] vLLM installed
- [ ] Help command works

---

## Phase 2: Data Collection and Preparation

### Step 2.1: Collect USWDS Documentation

```bash
# Create project structure
mkdir -p ~/uswds-agent/{data,models,scripts,docs}
cd ~/uswds-agent

# Clone USWDS repository
git clone https://github.com/uswds/uswds.git docs/uswds-repo

# Download documentation (create this script)
cat > scripts/download_uswds_docs.sh << 'EOF'
#!/bin/bash

DOCS_DIR="docs/uswds-documentation"
mkdir -p $DOCS_DIR

# Download key documentation pages
curl -o $DOCS_DIR/components.html https://designsystem.digital.gov/components/
curl -o $DOCS_DIR/design-tokens.html https://designsystem.digital.gov/design-tokens/
curl -o $DOCS_DIR/utilities.html https://designsystem.digital.gov/utilities/
curl -o $DOCS_DIR/accessibility.html https://designsystem.digital.gov/documentation/accessibility/
curl -o $DOCS_DIR/getting-started.html https://designsystem.digital.gov/documentation/getting-started/

echo "Documentation downloaded to $DOCS_DIR"
EOF

chmod +x scripts/download_uswds_docs.sh
./scripts/download_uswds_docs.sh
```

**Checkpoint:** USWDS repo cloned and docs downloaded
- [ ] Repository cloned to docs/uswds-repo
- [ ] Documentation files downloaded
- [ ] Component templates accessible

### Step 2.2: Extract Component Examples

```bash
# Create extraction script
cat > scripts/extract_components.py << 'EOF'
import os
import json
from pathlib import Path

def extract_uswds_components(repo_path, output_file):
    """Extract component examples from USWDS repo"""
    
    components = []
    
    # Key directories with component examples
    paths = [
        "packages/usa-button/src",
        "packages/usa-input/src",
        "packages/usa-alert/src",
        "packages/usa-accordion/src",
        "packages/usa-banner/src",
        "packages/usa-header/src",
        "packages/usa-footer/src",
        "packages/usa-form/src",
    ]
    
    for path in paths:
        full_path = Path(repo_path) / path
        if full_path.exists():
            for file in full_path.rglob("*.html"):
                with open(file, 'r') as f:
                    content = f.read()
                    components.append({
                        "component": path.split('/')[1],
                        "file": str(file.relative_to(repo_path)),
                        "content": content
                    })
    
    # Save to JSON
    with open(output_file, 'w') as f:
        json.dump(components, f, indent=2)
    
    print(f"Extracted {len(components)} component examples to {output_file}")

if __name__ == "__main__":
    extract_uswds_components("docs/uswds-repo", "data/uswds_components.json")
EOF

python scripts/extract_components.py
```

**Checkpoint:** Component examples extracted
- [ ] Script runs without errors
- [ ] data/uswds_components.json created
- [ ] File contains component examples

### Step 2.3: Start vLLM Server for Synthetic Data Generation

```bash
# Download and serve Llama 3.3 70B (requires 140GB+ VRAM for full model)
# For consumer GPUs, use smaller models:

# Option 1: Llama 3.1 8B (fits in 16GB VRAM)
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --port 8000 \
  --gpu-memory-utilization 0.9 \
  --max-model-len 4096 &

# Option 2: Qwen 2.5 14B (fits in 24GB VRAM)
# vllm serve Qwen/Qwen2.5-14B-Instruct \
#   --port 8000 \
#   --gpu-memory-utilization 0.9 \
#   --max-model-len 4096 &

# Wait for server to start
sleep 30

# Test the server
curl http://localhost:8000/v1/models

# Test generation
curl http://localhost:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "prompt": "Write a USWDS button component:",
    "max_tokens": 100
  }'
```

**Checkpoint:** vLLM server running and responding
- [ ] vLLM server started
- [ ] Server responds to /v1/models
- [ ] Test completion succeeds

### Step 2.4: Configure Synthetic Data Generation

```bash
# Create configuration for synthetic data generation
cat > data/generation_config.yaml << 'EOF'
# USWDS Synthetic Data Generation Configuration

model:
  base_url: "http://localhost:8000/v1"
  model_name: "meta-llama/Llama-3.1-8B-Instruct"
  temperature: 0.7
  max_tokens: 2000

generation:
  type: "cot"  # Chain-of-thought for code
  num_pairs: 100
  chunk_size: 3000
  batch_size: 5

prompts:
  system: |
    You are an expert in the U.S. Web Design System (USWDS). Generate high-quality,
    accessible code examples following USWDS best practices.

  qa_generation: |
    Based on the following USWDS documentation, create a question-answer pair for 
    training a code generation model.
    
    Requirements:
    1. Question should ask for a specific USWDS component implementation
    2. Answer must include complete, working HTML/CSS code
    3. All code must follow WCAG 2.1 AA accessibility standards
    4. Include proper ARIA attributes and semantic HTML
    5. Use USWDS design tokens (e.g., 'primary', 'secondary') not hex colors
    6. Use USWDS utility classes with usa- prefix
    7. Add a brief explanation of key accessibility features
    8. Include responsive behavior considerations
    
    Format as JSON:
    {
      "question": "How do I create...",
      "answer": "Here's how to create...\n\n```html\n...\n```\n\nAccessibility notes: ..."
    }
    
    Source documentation:
    {text}
    
    Generate ONE high-quality example:

  cot_generation: |
    Based on the following USWDS documentation, create a coding example with 
    step-by-step reasoning (Chain-of-Thought).
    
    Format:
    {
      "task": "Create a [component]...",
      "reasoning": [
        "First, I need to...",
        "Then, I should...",
        "Finally, I'll..."
      ],
      "code": "```html\n...\n```",
      "accessibility": "This implementation ensures..."
    }
    
    Requirements:
    - Complete, executable code
    - USWDS classes and design tokens
    - WCAG 2.1 AA compliance
    - Semantic HTML with ARIA attributes
    - Explanation of each step
    
    Source:
    {text}
    
    Generate ONE example:

quality_control:
  threshold: 8.5
  dimensions:
    - accuracy
    - relevance
    - clarity
    - usefulness
    - accessibility
EOF
```

**Checkpoint:** Configuration file created
- [ ] generation_config.yaml created
- [ ] Prompts emphasize USWDS and accessibility
- [ ] Quality threshold set to 8.5

### Step 2.5: Generate Synthetic Training Data

```bash
# Create generation script
cat > scripts/generate_synthetic_data.py << 'EOF'
#!/usr/bin/env python3
import os
import json
import yaml
from pathlib import Path
import subprocess
import time

def run_synthetic_generation():
    """Generate synthetic USWDS training data"""
    
    # Load configuration
    with open('data/generation_config.yaml', 'r') as f:
        config = yaml.safe_load(f)
    
    print("Starting synthetic data generation...")
    
    # Step 1: Ingest USWDS documentation
    print("\n[1/4] Ingesting documentation...")
    subprocess.run([
        "synthetic-data-kit", "ingest",
        "docs/uswds-documentation/",
        "--output-dir", "data/parsed/"
    ])
    
    # Also ingest component examples
    subprocess.run([
        "synthetic-data-kit", "ingest",
        "data/uswds_components.json",
        "--output-dir", "data/parsed/"
    ])
    
    # Step 2: Create synthetic examples
    print("\n[2/4] Generating synthetic examples...")
    subprocess.run([
        "synthetic-data-kit", "create",
        "data/parsed/",
        "--type", "cot",
        "--num-pairs", str(config['generation']['num_pairs']),
        "--chunk-size", str(config['generation']['chunk_size']),
        "--output-dir", "data/generated/"
    ])
    
    # Step 3: Curate/filter examples
    print("\n[3/4] Curating examples (quality threshold: {})...".format(
        config['quality_control']['threshold']
    ))
    subprocess.run([
        "synthetic-data-kit", "curate",
        "data/generated/",
        "--threshold", str(config['quality_control']['threshold']),
        "--output-dir", "data/curated/"
    ])
    
    # Step 4: Export in training format
    print("\n[4/4] Exporting to training format...")
    subprocess.run([
        "synthetic-data-kit", "save-as",
        "data/curated/",
        "--format", "ft",
        "--output-dir", "data/training/"
    ])
    
    print("\nSynthetic data generation complete!")
    print(f"Training data saved to: data/training/")

if __name__ == "__main__":
    run_synthetic_generation()
EOF

chmod +x scripts/generate_synthetic_data.py

# Run generation (this will take 30-60 minutes)
python scripts/generate_synthetic_data.py
```

**Checkpoint:** Synthetic data generated successfully
- [ ] Ingestion completed
- [ ] Examples generated
- [ ] Quality filtering applied
- [ ] Training data exported

### Step 2.6: Format Data for Llama 3.1

```bash
# Create formatting script
cat > scripts/format_training_data.py << 'EOF'
#!/usr/bin/env python3
import json
from pathlib import Path

def format_for_llama31(input_file, output_file):
    """Convert synthetic data to Llama 3.1 chat format"""
    
    template = """<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert in the U.S. Web Design System (USWDS). You generate accessible, production-ready code following USWDS best practices, design tokens, and WCAG 2.1 AA standards. Always use:
- Semantic HTML5 elements
- USWDS classes with usa- prefix
- Design tokens instead of hard-coded values
- Proper ARIA attributes
- Mobile-first responsive patterns<|eot_id|><|start_header_id|>user<|end_header_id|>

{instruction}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{response}<|eot_id|>"""
    
    # Load synthetic data
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    formatted_examples = []
    
    for item in data:
        # Extract instruction and response
        # Adjust based on your synthetic data format
        instruction = item.get('question') or item.get('task') or item.get('instruction')
        response = item.get('answer') or item.get('output') or item.get('response')
        
        if instruction and response:
            formatted = template.format(
                instruction=instruction.strip(),
                response=response.strip()
            )
            formatted_examples.append({"text": formatted})
    
    # Write JSONL format (one JSON object per line)
    with open(output_file, 'w') as f:
        for example in formatted_examples:
            json.dump(example, f)
            f.write('\n')
    
    print(f"Formatted {len(formatted_examples)} examples")
    print(f"Output: {output_file}")

if __name__ == "__main__":
    format_for_llama31(
        "data/training/synthetic_data.json",
        "data/training/uswds_training.jsonl"
    )
EOF

python scripts/format_training_data.py
```

**Checkpoint:** Training data formatted for Llama 3.1
- [ ] Script runs successfully
- [ ] JSONL file created
- [ ] Examples properly formatted

---

## Phase 3: Model Fine-tuning

### Step 3.1: Create Fine-tuning Script

```bash
cat > scripts/finetune_model.py << 'EOF'
#!/usr/bin/env python3
from unsloth import FastLanguageModel
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments
import torch

# Configuration
MAX_SEQ_LENGTH = 2048
MODEL_NAME = "unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit"
OUTPUT_DIR = "models/uswds-coder-lora"
TRAINING_DATA = "data/training/uswds_training.jsonl"

def setup_model():
    """Load and configure model for fine-tuning"""
    
    print("Loading model...")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=MODEL_NAME,
        max_seq_length=MAX_SEQ_LENGTH,
        dtype=None,  # Auto-detect
        load_in_4bit=True,
    )
    
    print("Adding LoRA adapters...")
    model = FastLanguageModel.get_peft_model(
        model,
        r=16,  # Rank
        target_modules=[
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj"
        ],
        lora_alpha=16,
        lora_dropout=0,
        bias="none",
        use_gradient_checkpointing="unsloth",
        random_state=3407,
    )
    
    return model, tokenizer

def load_training_data(data_path):
    """Load JSONL training data"""
    
    print(f"Loading training data from {data_path}...")
    dataset = load_dataset("json", data_files=data_path, split="train")
    
    print(f"Loaded {len(dataset)} training examples")
    print(f"Sample: {dataset[0]['text'][:200]}...")
    
    return dataset

def train_model(model, tokenizer, dataset):
    """Configure and run training"""
    
    print("Configuring trainer...")
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=MAX_SEQ_LENGTH,
        args=TrainingArguments(
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            warmup_steps=5,
            max_steps=200,  # Adjust based on dataset size
            learning_rate=2e-4,
            fp16=not torch.cuda.is_bf16_supported(),
            bf16=torch.cuda.is_bf16_supported(),
            logging_steps=10,
            optim="adamw_8bit",
            weight_decay=0.01,
            lr_scheduler_type="linear",
            seed=3407,
            output_dir=OUTPUT_DIR,
            gradient_checkpointing=True,
        ),
    )
    
    print("Starting training...")
    trainer.train()
    
    return trainer

def save_model(model, tokenizer):
    """Save LoRA adapters and export to GGUF"""
    
    print(f"\nSaving LoRA adapters to {OUTPUT_DIR}...")
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    
    print("Exporting to GGUF format...")
    model.save_pretrained_gguf(
        "models/uswds-coder-gguf",
        tokenizer,
        quantization_method=["q8_0", "q4_k_m"]
    )
    
    print("Model saved successfully!")

def main():
    """Main fine-tuning pipeline"""
    
    print("="*60)
    print("USWDS Coding Agent - Fine-tuning Pipeline")
    print("="*60)
    
    # Setup
    model, tokenizer = setup_model()
    dataset = load_training_data(TRAINING_DATA)
    
    # Train
    trainer = train_model(model, tokenizer, dataset)
    
    # Save
    save_model(model, tokenizer)
    
    print("\n" + "="*60)
    print("Fine-tuning complete!")
    print("="*60)
    print(f"LoRA adapters: {OUTPUT_DIR}")
    print(f"GGUF models: models/uswds-coder-gguf")

if __name__ == "__main__":
    main()
EOF

chmod +x scripts/finetune_model.py
```

**Checkpoint:** Fine-tuning script created
- [ ] Script created successfully
- [ ] Paths configured correctly

### Step 3.2: Run Fine-tuning

```bash
# Start fine-tuning (will take 1-3 hours on RTX 4090)
python scripts/finetune_model.py

# Monitor GPU usage in another terminal
watch -n 1 nvidia-smi
```

**Checkpoint:** Fine-tuning completes successfully
- [ ] Training started without errors
- [ ] Loss decreases over time
- [ ] LoRA adapters saved
- [ ] GGUF files exported

### Step 3.3: Create Modelfile for OLLAMA

```bash
# Create Modelfile
cat > models/Modelfile << 'EOF'
# USWDS Coding Agent Modelfile
FROM ./uswds-coder-gguf/unsloth.Q8_0.gguf

# Llama 3.1 Chat Template
TEMPLATE """{{ if .System }}<|start_header_id|>system<|end_header_id|>
{{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>user<|end_header_id|>
{{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>
{{ .Response }}<|eot_id|>"""

# Stop sequences for Llama 3.1
PARAMETER stop "<|start_header_id|>"
PARAMETER stop "<|end_header_id|>"
PARAMETER stop "<|eot_id|>"
PARAMETER stop "<|eom_id|>"

# Generation parameters
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.1

# System prompt
SYSTEM """You are an expert USWDS (U.S. Web Design System) coding assistant. You generate accessible, production-ready code following USWDS best practices, design tokens, and WCAG 2.1 AA standards.

Always include:
- Semantic HTML5 elements
- USWDS classes with usa- prefix (e.g., usa-button, usa-input)
- Design tokens for colors and spacing (never hard-coded values)
- Proper ARIA attributes for accessibility
- Mobile-first responsive patterns
- Brief explanations of accessibility features

Never use placeholder text like "..." or "rest of code". Always provide complete, working examples."""
EOF
```

**Checkpoint:** Modelfile created
- [ ] Modelfile created successfully
- [ ] Template configured for Llama 3.1
- [ ] System prompt emphasizes USWDS

### Step 3.4: Import to OLLAMA

```bash
cd ~/uswds-agent/models

# Create the model in OLLAMA
ollama create uswds-coder -f Modelfile

# Verify model is available
ollama list | grep uswds-coder
```

**Checkpoint:** Model imported to OLLAMA
- [ ] Model created without errors
- [ ] Model appears in `ollama list`

### Step 3.5: Test the Fine-tuned Model

```bash
# Create test script
cat > scripts/test_model.sh << 'EOF'
#!/bin/bash

echo "Testing USWDS Coding Agent..."
echo "================================"
echo

# Test 1: Simple button
echo "Test 1: Simple button component"
ollama run uswds-coder "Create a USWDS primary button"
echo
echo "---"
echo

# Test 2: Form input
echo "Test 2: Form input with validation"
ollama run uswds-coder "Create a USWDS text input with error state and proper ARIA attributes"
echo
echo "---"
echo

# Test 3: Alert component
echo "Test 3: Alert component"
ollama run uswds-coder "Create a USWDS success alert with proper accessibility"
echo

echo "Testing complete!"
EOF

chmod +x scripts/test_model.sh
./scripts/test_model.sh > test_results.txt

# Review results
cat test_results.txt
```

**Checkpoint:** Model generates USWDS code
- [ ] Model responds to prompts
- [ ] Code includes usa- prefixed classes
- [ ] ARIA attributes present
- [ ] Code is complete (no placeholders)

---

## Phase 4: MCP Integration for Agentic Capabilities

### Step 4.1: Install MCP Client

```bash
# Install Node.js if not present
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install MCP client for OLLAMA
git clone https://github.com/jonigl/mcp-client-for-ollama.git ~/uswds-agent/mcp-client
cd ~/uswds-agent/mcp-client
npm install
```

**Checkpoint:** MCP client installed
- [ ] Node.js installed
- [ ] MCP client cloned
- [ ] Dependencies installed

### Step 4.2: Install MCP Servers

```bash
# Install filesystem server
npm install -g @modelcontextprotocol/server-filesystem

# Install puppeteer server for web fetching
npm install -g @modelcontextprotocol/server-puppeteer

# Install git server
pip install mcp-server-git

# Verify installations
npx @modelcontextprotocol/server-filesystem --help
```

**Checkpoint:** MCP servers installed
- [ ] Filesystem server installed
- [ ] Puppeteer server installed
- [ ] Git server installed

### Step 4.3: Configure MCP Servers

```bash
cd ~/uswds-agent

# Create MCP configuration
cat > mcp_config.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/YOUR_USERNAME/uswds-agent/workspace"
      ]
    },
    "uswds-docs": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/YOUR_USERNAME/uswds-agent/docs/uswds-repo/packages"
      ]
    },
    "web-fetch": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ]
    }
  },
  "llm": {
    "model": "uswds-coder",
    "baseUrl": "http://localhost:11434"
  }
}
EOF

# Replace YOUR_USERNAME with actual username
sed -i "s/YOUR_USERNAME/$USER/g" mcp_config.json

# Create workspace directory
mkdir -p workspace
```

**Checkpoint:** MCP servers configured
- [ ] Configuration file created
- [ ] Paths updated with correct username
- [ ] Workspace directory created

### Step 4.4: Create Agent with LangGraph

```bash
# Install LangGraph and dependencies
pip install langgraph langchain-core langchain-community langchain-ollama

# Create agent script
cat > scripts/uswds_agent.py << 'EOF'
#!/usr/bin/env python3
from langchain_ollama import ChatOllama
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.prebuilt import create_react_agent
from pathlib import Path
import subprocess
import json

# Initialize OLLAMA model
llm = ChatOllama(
    model="uswds-coder",
    temperature=0.7,
    base_url="http://localhost:11434"
)

# Define tools
@tool
def read_uswds_component(component_name: str) -> str:
    """Read USWDS component template from packages directory.
    
    Args:
        component_name: Name of component (e.g., 'usa-button', 'usa-input')
    """
    base_path = Path("~/uswds-agent/docs/uswds-repo/packages").expanduser()
    component_path = base_path / component_name / "src"
    
    if not component_path.exists():
        return f"Component {component_name} not found"
    
    examples = []
    for html_file in component_path.rglob("*.html"):
        with open(html_file, 'r') as f:
            examples.append(f"File: {html_file.name}\n{f.read()}\n")
    
    return "\n---\n".join(examples) if examples else "No examples found"

@tool
def write_component(filename: str, code: str) -> str:
    """Write generated component code to workspace.
    
    Args:
        filename: Name of file to write (e.g., 'button-component.html')
        code: Complete HTML/CSS code to write
    """
    workspace = Path("~/uswds-agent/workspace").expanduser()
    file_path = workspace / filename
    
    try:
        with open(file_path, 'w') as f:
            f.write(code)
        return f"Successfully wrote {len(code)} characters to {filename}"
    except Exception as e:
        return f"Error writing file: {str(e)}"

@tool
def list_workspace_files() -> str:
    """List all files in the workspace directory."""
    workspace = Path("~/uswds-agent/workspace").expanduser()
    
    files = list(workspace.glob("*"))
    if not files:
        return "Workspace is empty"
    
    return "\n".join([f"- {f.name}" for f in files])

@tool
def validate_html(html_code: str) -> dict:
    """Validate HTML for basic syntax and USWDS patterns.
    
    Args:
        html_code: HTML code to validate
    """
    issues = []
    
    # Check for usa- prefix
    if "usa-" not in html_code:
        issues.append("No USWDS classes (usa- prefix) found")
    
    # Check for ARIA attributes in interactive elements
    if "<button" in html_code and "aria-" not in html_code:
        issues.append("Button element missing ARIA attributes")
    
    if "<input" in html_code and "aria-" not in html_code:
        issues.append("Input element missing ARIA attributes")
    
    # Check for semantic HTML
    if "<div" in html_code and "role=" not in html_code and "class=" in html_code:
        issues.append("Consider using semantic HTML instead of divs")
    
    return {
        "valid": len(issues) == 0,
        "issues": issues,
        "message": "Validation passed!" if len(issues) == 0 else f"Found {len(issues)} issues"
    }

# Create agent
tools = [
    read_uswds_component,
    write_component,
    list_workspace_files,
    validate_html
]

agent = create_react_agent(
    llm,
    tools,
    state_modifier=SystemMessage(content="""You are a USWDS coding assistant with access to tools.

When the user asks for a component:
1. Use read_uswds_component to see official USWDS examples
2. Generate complete, accessible code based on those examples
3. Use validate_html to check your code
4. If validation fails, fix the issues and validate again
5. Use write_component to save the final code
6. Tell the user where the file was saved

Always:
- Include complete code (no placeholders or "...")
- Use USWDS classes and design tokens
- Add proper ARIA attributes
- Explain accessibility features""")
)

def run_agent(user_request: str):
    """Run the agent with a user request"""
    
    print(f"\n{'='*60}")
    print(f"User Request: {user_request}")
    print(f"{'='*60}\n")
    
    result = agent.invoke({
        "messages": [HumanMessage(content=user_request)]
    })
    
    # Print agent's response
    final_message = result["messages"][-1]
    print(f"\nAgent Response:\n{final_message.content}\n")
    
    return result

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        request = " ".join(sys.argv[1:])
        run_agent(request)
    else:
        # Interactive mode
        print("USWDS Agent - Interactive Mode")
        print("Type 'exit' to quit\n")
        
        while True:
            request = input("\nYour request: ")
            if request.lower() in ['exit', 'quit']:
                break
            
            run_agent(request)
EOF

chmod +x scripts/uswds_agent.py
```

**Checkpoint:** Agent script created
- [ ] LangGraph installed
- [ ] Agent script created
- [ ] Tools defined correctly

### Step 4.5: Test the Agent

```bash
# Test the agent
cd ~/uswds-agent

# Test 1: Simple component generation
python scripts/uswds_agent.py "Create an accessible USWDS button group with primary and secondary buttons"

# Test 2: Form component with validation
python scripts/uswds_agent.py "Create a USWDS form with text input, email input, and submit button. Include proper validation states and accessibility."

# Check workspace for generated files
ls -la workspace/

# View generated file
cat workspace/*.html
```

**Checkpoint:** Agent generates and saves components
- [ ] Agent responds to requests
- [ ] Tools are called correctly
- [ ] Files written to workspace
- [ ] Code includes USWDS patterns

---

## Phase 5: Testing and Validation

### Step 5.1: Create Test Suite

```bash
cat > scripts/test_suite.py << 'EOF'
#!/usr/bin/env python3
import subprocess
import json
from pathlib import Path

test_cases = [
    {
        "name": "Basic Button",
        "prompt": "Create a USWDS primary button",
        "checks": ["usa-button", "class=", "<button"]
    },
    {
        "name": "Button Group",
        "prompt": "Create a USWDS button group with primary and outline buttons",
        "checks": ["usa-button-group", "usa-button--outline", "aria-"]
    },
    {
        "name": "Form Input",
        "prompt": "Create a USWDS text input with label and error state",
        "checks": ["usa-input", "usa-label", "aria-describedby", "usa-error-message"]
    },
    {
        "name": "Alert Component",
        "prompt": "Create a USWDS success alert",
        "checks": ["usa-alert", "usa-alert--success", "role="]
    },
    {
        "name": "Accessible Form",
        "prompt": "Create a complete form with name and email inputs, proper labels, and a submit button",
        "checks": ["<form", "usa-form", "for=", "id=", "type=\"submit\""]
    }
]

def run_test(test_case):
    """Run a single test case"""
    print(f"\nTesting: {test_case['name']}")
    print(f"Prompt: {test_case['prompt']}")
    
    # Generate with agent
    result = subprocess.run(
        ["python", "scripts/uswds_agent.py", test_case['prompt']],
        capture_output=True,
        text=True
    )
    
    output = result.stdout
    
    # Check for required patterns
    passed = []
    failed = []
    
    for check in test_case['checks']:
        if check in output:
            passed.append(check)
        else:
            failed.append(check)
    
    success = len(failed) == 0
    
    print(f"Result: {'✓ PASSED' if success else '✗ FAILED'}")
    if failed:
        print(f"Missing: {', '.join(failed)}")
    
    return success

def main():
    print("="*60)
    print("USWDS Agent Test Suite")
    print("="*60)
    
    results = []
    for test in test_cases:
        success = run_test(test)
        results.append({"test": test['name'], "passed": success})
    
    # Summary
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    
    passed_count = sum(1 for r in results if r['passed'])
    total_count = len(results)
    
    for result in results:
        status = "✓" if result['passed'] else "✗"
        print(f"{status} {result['test']}")
    
    print(f"\nPassed: {passed_count}/{total_count}")
    print(f"Success Rate: {passed_count/total_count*100:.1f}%")

if __name__ == "__main__":
    main()
EOF

chmod +x scripts/test_suite.py

# Run test suite
python scripts/test_suite.py
```

**Checkpoint:** Test suite runs successfully
- [ ] All tests execute
- [ ] Success rate >70%
- [ ] Generated code includes USWDS patterns

### Step 5.2: Accessibility Validation

```bash
# Install accessibility testing tools
npm install -g pa11y

# Create accessibility validation script
cat > scripts/validate_accessibility.sh << 'EOF'
#!/bin/bash

echo "Validating accessibility of generated components..."
echo

WORKSPACE="workspace"
RESULTS_FILE="accessibility_results.txt"

# Clear previous results
> $RESULTS_FILE

# Test each HTML file
for file in $WORKSPACE/*.html; do
    if [ -f "$file" ]; then
        echo "Testing: $(basename $file)"
        echo "================================" >> $RESULTS_FILE
        echo "File: $(basename $file)" >> $RESULTS_FILE
        echo >> $RESULTS_FILE
        
        pa11y --standard WCAG2AA "$file" >> $RESULTS_FILE 2>&1
        
        echo >> $RESULTS_FILE
        echo >> $RESULTS_FILE
    fi
done

echo
echo "Results saved to: $RESULTS_FILE"
cat $RESULTS_FILE
EOF

chmod +x scripts/validate_accessibility.sh

# Run accessibility validation
./scripts/validate_accessibility.sh
```

**Checkpoint:** Accessibility validation runs
- [ ] pa11y installed
- [ ] Script tests generated files
- [ ] Results show WCAG compliance

---

## Final Deployment Checklist

### Production Readiness

- [ ] Model fine-tuned and tested
- [ ] Agent generates correct USWDS code
- [ ] Accessibility validation passes
- [ ] MCP servers configured correctly
- [ ] Error handling implemented
- [ ] Test suite passing >80%
- [ ] Documentation complete

### Performance Optimization

- [ ] Model quantized appropriately (Q8_0 or Q4_K_M)
- [ ] OLLAMA runs efficiently
- [ ] Agent response time <30 seconds
- [ ] GPU utilization optimized

### Monitoring and Logging

```bash
# Create logging configuration
cat > scripts/monitor.sh << 'EOF'
#!/bin/bash

# Monitor GPU usage
watch -n 5 nvidia-smi >> logs/gpu_usage.log &

# Monitor OLLAMA
tail -f ~/.ollama/logs/server.log &

echo "Monitoring started. Logs in logs/ directory"
EOF

chmod +x scripts/monitor.sh

mkdir -p logs
```

- [ ] Monitoring scripts created
- [ ] Logging configured
- [ ] GPU usage tracked

---

## Quick Start After Setup

Once everything is configured, you can use the agent with:

```bash
# Activate environment
conda activate uswds-agent
cd ~/uswds-agent

# Ensure OLLAMA is running
ollama serve &

# Use the agent interactively
python scripts/uswds_agent.py

# Or with a specific request
python scripts/uswds_agent.py "Create a USWDS multi-step form with step indicator"

# Check generated files
ls -la workspace/
cat workspace/*.html
```

---

## Troubleshooting

### Issue: CUDA out of memory
```bash
# Reduce batch size in finetune_model.py
# Change: per_device_train_batch_size=2 to =1

# Or use smaller model
# Change: MODEL_NAME = "unsloth/Llama-3.2-3B-Instruct-bnb-4bit"
```

### Issue: OLLAMA model not responding
```bash
# Restart OLLAMA
pkill ollama
ollama serve &

# Test connectivity
ollama list
```

### Issue: MCP servers not connecting
```bash
# Check server installation
npx @modelcontextprotocol/server-filesystem --help

# Verify paths in mcp_config.json
cat mcp_config.json
```

### Issue: Agent not generating correct code
```bash
# Review system prompt
# Fine-tune with more targeted examples
# Increase quality threshold in generation_config.yaml
```

---

**Implementation Complete!** 

You now have a fully functional USWDS coding agent running locally with:
- Fine-tuned model specialized in USWDS
- Agentic capabilities via MCP and LangGraph
- Accessibility validation
- Test suite for continuous validation

Next steps:
1. Generate more synthetic data for weak areas
2. Iterate fine-tuning with additional examples
3. Add custom MCP servers for specific USWDS validation
4. Deploy as API endpoint or web interface
