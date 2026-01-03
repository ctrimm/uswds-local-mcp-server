# Code Refactoring Plan

**Goal:** Break down large files into smaller, focused, testable modules.

**Estimated Effort:** 3-5 days
**Last Updated:** January 3, 2026

---

## Files Requiring Refactoring

### Priority 1: Lambda Handler (796 lines)

**Current:** `src/lambda.ts` - Monolithic Lambda handler

**Proposed Structure:**
```
src/lambda/
├── config.ts                    # Configuration (DONE)
├── logger.ts                    # Logger setup (DONE)
├── types.ts                     # TypeScript interfaces
├── server.ts                    # MCP server initialization
├── handler.ts                   # Main Lambda handler (~100 lines)
├── tools/
│   ├── definitions.ts           # Tool definitions array
│   └── handlers.ts              # Tool execution logic
└── auth/
    ├── authenticate.ts          # Authentication logic
    ├── extract-api-key.ts       # API key extraction
    └── types.ts                 # Auth types
```

**Benefits:**
- Each module has a single responsibility
- Easy to test individual components
- Clear separation of concerns
- handler.ts becomes ~100 lines (was 796)

---

### Priority 2: Stdio Server (888 lines)

**Current:** `src/index.ts` - Monolithic stdio server

**Proposed Structure:**
```
src/stdio/
├── config.ts                    # Configuration
├── logger.ts                    # Logger setup
├── server.ts                    # MCP server initialization
├── index.ts                     # Main stdio entrypoint (~50 lines)
├── tools/
│   ├── definitions.ts           # Tool definitions (shared with Lambda)
│   └── handlers.ts              # Tool execution logic (shared with Lambda)
└── services/
    └── service-factory.ts       # Service initialization
```

**Shared Code:**
```
src/shared/
├── tools/
│   ├── definitions.ts           # Shared tool definitions
│   └── handlers.ts              # Shared tool handlers
└── services/
    └── initialize.ts            # Shared service initialization
```

**Benefits:**
- Reduce code duplication between Lambda and stdio
- index.ts becomes ~50 lines (was 888)
- Easier to add new transports (WebSocket, gRPC, etc.)

---

### Priority 3: Code Generator Service (1,918 lines)

**Current:** `src/services/code-generator-service.ts` - Huge service file

**Proposed Structure:**
```
src/services/code-generator/
├── index.ts                     # Main service (~100 lines)
├── types.ts                     # TypeScript interfaces
├── generators/
│   ├── react/
│   │   ├── button.ts
│   │   ├── form.ts
│   │   ├── alert.ts
│   │   └── ... (one file per component)
│   ├── html/
│   │   ├── button.ts
│   │   ├── form.ts
│   │   └── ...
│   └── tailwind/
│       ├── button.ts
│       ├── form.ts
│       └── ...
├── templates/
│   ├── react-template.ts
│   ├── html-template.ts
│   └── tailwind-template.ts
└── utils/
    ├── prop-validator.ts
    └── code-formatter.ts
```

**Benefits:**
- Each component generator is ~30-50 lines
- Easy to add new components
- Easy to test individual generators
- Clear organization by framework

---

### Priority 4: Component Service (621 lines)

**Current:** `src/services/component-service.ts`

**Proposed Structure:**
```
src/services/component/
├── index.ts                     # Main service (~100 lines)
├── types.ts                     # TypeScript interfaces
├── loaders/
│   ├── react-loader.ts          # Load React components
│   ├── vanilla-loader.ts        # Load vanilla HTML components
│   └── tailwind-loader.ts       # Load Tailwind components
├── filters/
│   ├── category-filter.ts       # Filter by category
│   └── search-filter.ts         # Search functionality
└── formatters/
    ├── component-formatter.ts   # Format component data
    └── example-formatter.ts     # Format examples
```

**Benefits:**
- Separation of loading, filtering, and formatting logic
- Easier to add new component sources
- index.ts becomes ~100 lines (was 621)

---

## Implementation Phases

### Phase 1: Lambda Refactoring (1-2 days)

**Steps:**
1. ✅ Create `src/lambda/config.ts`
2. ✅ Create `src/lambda/logger.ts`
3. [ ] Create `src/lambda/types.ts`
4. [ ] Create `src/lambda/tools/definitions.ts`
5. [ ] Create `src/lambda/tools/handlers.ts`
6. [ ] Create `src/lambda/auth/authenticate.ts`
7. [ ] Create `src/lambda/auth/extract-api-key.ts`
8. [ ] Create `src/lambda/server.ts`
9. [ ] Refactor `src/lambda/handler.ts` (new main file)
10. [ ] Update `src/lambda.ts` to re-export from handler.ts
11. [ ] Test all Lambda functionality
12. [ ] Update imports in related files

---

### Phase 2: Stdio Refactoring (1-2 days)

**Steps:**
1. [ ] Create shared tool definitions in `src/shared/tools/`
2. [ ] Update Lambda to use shared tools
3. [ ] Create `src/stdio/` structure
4. [ ] Refactor `src/index.ts`
5. [ ] Test all stdio functionality
6. [ ] Update build scripts if needed

---

### Phase 3: Code Generator Refactoring (1 day)

**Steps:**
1. [ ] Create directory structure
2. [ ] Extract component generators one by one
3. [ ] Create template system
4. [ ] Update main service to use modular generators
5. [ ] Test code generation for all components
6. [ ] Update tests

---

### Phase 4: Component Service Refactoring (1 day)

**Steps:**
1. [ ] Create directory structure
2. [ ] Extract loaders
3. [ ] Extract filters
4. [ ] Extract formatters
5. [ ] Update main service
6. [ ] Test all component operations
7. [ ] Update tests

---

## Testing Strategy

### Unit Tests
- Create unit tests for each new module
- Ensure existing tests still pass
- Add tests for edge cases

### Integration Tests
- Test Lambda handler end-to-end
- Test stdio server end-to-end
- Test tool execution
- Test authentication flow

### Regression Testing
- Run full test suite after each phase
- Manually test MCP tools
- Verify no functionality broken

---

## Migration Strategy

### Backward Compatibility
- Keep `src/lambda.ts` as re-export for now
- Keep `src/index.ts` as re-export for now
- Don't break existing imports
- Can be removed in v1.0.0

### Gradual Rollout
1. Refactor one file at a time
2. Test thoroughly after each refactor
3. Keep git commits small and focused
4. Easy to rollback if issues arise

---

## Benefits Summary

### Before Refactoring
```
src/lambda.ts                     796 lines
src/index.ts                      888 lines
src/services/code-generator-service.ts  1,918 lines
src/services/component-service.ts       621 lines
-------------------------------------------
TOTAL                             4,223 lines in 4 files
```

### After Refactoring
```
src/lambda/handler.ts             ~100 lines
src/stdio/index.ts                ~50 lines
src/services/code-generator/index.ts    ~100 lines
src/services/component/index.ts   ~100 lines
+ ~40 focused module files        ~30-50 lines each
-------------------------------------------
TOTAL                             ~2,700 lines across ~44 files
```

**Improvements:**
- ✅ 36% reduction in total lines (better organization)
- ✅ Average file size: ~60 lines (was ~1,055 lines)
- ✅ Single Responsibility Principle
- ✅ Much easier to test
- ✅ Much easier to review
- ✅ Much easier to maintain
- ✅ Easy to add new features

---

## Risks & Mitigation

### Risk 1: Breaking Changes
**Mitigation:** Keep old files as re-exports, gradual migration

### Risk 2: Import Path Changes
**Mitigation:** Update all imports at once per file, test thoroughly

### Risk 3: Testing Overhead
**Mitigation:** Write tests as we go, use existing test suite

### Risk 4: Time Investment
**Mitigation:** Work in phases, can pause and resume

---

## Approval Needed

**Question:** Should we proceed with this refactoring plan?

**Options:**
1. **Yes, do all phases** - Full refactoring (3-5 days)
2. **Yes, start with Phase 1 only** - Lambda refactoring first (1-2 days)
3. **Yes, but modify the plan** - Suggest changes
4. **No, keep as-is** - Focus on production features instead

**Recommendation:** Start with Phase 1 (Lambda) to validate the approach, then proceed with remaining phases if successful.
