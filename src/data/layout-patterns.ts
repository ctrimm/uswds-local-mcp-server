/**
 * Common Layout Patterns using USWDS Grid
 */

export interface LayoutPattern {
  name: string;
  description: string;
  useCase: string[];
  code: {
    react: string;
    html: string;
  };
  responsive: boolean;
  preview?: string;
}

export const LAYOUT_PATTERNS: Record<string, LayoutPattern> = {
  'single-column': {
    name: 'Single Column',
    description: 'Centered single column layout, ideal for focused content',
    useCase: [
      'Blog posts',
      'Article pages',
      'Forms',
      'Login pages'
    ],
    code: {
      react: `import { GridContainer } from '@trussworks/react-uswds'

export default function Layout({ children }) {
  return (
    <GridContainer className="usa-section">
      <div className="grid-row flex-justify-center">
        <div className="grid-col-12 tablet:grid-col-10 desktop:grid-col-8">
          {children}
        </div>
      </div>
    </GridContainer>
  )
}`,
      html: `<div class="grid-container usa-section">
  <div class="grid-row flex-justify-center">
    <div class="grid-col-12 tablet:grid-col-10 desktop:grid-col-8">
      <!-- Content here -->
    </div>
  </div>
</div>`
    },
    responsive: true
  },

  'two-column': {
    name: 'Two Column (Equal)',
    description: 'Two equal columns side by side',
    useCase: [
      'Feature comparisons',
      'Image and text layouts',
      'Dual content areas'
    ],
    code: {
      react: `import { GridContainer, Grid } from '@trussworks/react-uswds'

export default function Layout({ left, right }) {
  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        <Grid col={12} tablet={{ col: 6 }}>
          {left}
        </Grid>
        <Grid col={12} tablet={{ col: 6 }}>
          {right}
        </Grid>
      </Grid>
    </GridContainer>
  )
}`,
      html: `<div class="grid-container usa-section">
  <div class="grid-row grid-gap">
    <div class="grid-col-12 tablet:grid-col-6">
      <!-- Left content -->
    </div>
    <div class="grid-col-12 tablet:grid-col-6">
      <!-- Right content -->
    </div>
  </div>
</div>`
    },
    responsive: true
  },

  'sidebar-content': {
    name: 'Sidebar + Content',
    description: 'Sidebar navigation with main content area',
    useCase: [
      'Documentation',
      'Settings pages',
      'Dashboard layouts',
      'Admin panels'
    ],
    code: {
      react: `import { GridContainer, Grid } from '@trussworks/react-uswds'

export default function Layout({ sidebar, content }) {
  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        <Grid col={12} desktop={{ col: 3 }}>
          <aside className="usa-layout-docs__sidenav">
            {sidebar}
          </aside>
        </Grid>
        <Grid col={12} desktop={{ col: 9 }}>
          <main className="usa-layout-docs__main">
            {content}
          </main>
        </Grid>
      </Grid>
    </GridContainer>
  )
}`,
      html: `<div class="grid-container usa-section">
  <div class="grid-row grid-gap">
    <div class="grid-col-12 desktop:grid-col-3">
      <aside class="usa-layout-docs__sidenav">
        <!-- Sidebar navigation -->
      </aside>
    </div>
    <div class="grid-col-12 desktop:grid-col-9">
      <main class="usa-layout-docs__main">
        <!-- Main content -->
      </main>
    </div>
  </div>
</div>`
    },
    responsive: true
  },

  'content-sidebar': {
    name: 'Content + Sidebar',
    description: 'Main content with right sidebar (reverse of sidebar-content)',
    useCase: [
      'Blog with related content',
      'Articles with table of contents',
      'Content with filters'
    ],
    code: {
      react: `import { GridContainer, Grid } from '@trussworks/react-uswds'

export default function Layout({ content, sidebar }) {
  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        <Grid col={12} desktop={{ col: 8 }}>
          <main>
            {content}
          </main>
        </Grid>
        <Grid col={12} desktop={{ col: 4 }}>
          <aside>
            {sidebar}
          </aside>
        </Grid>
      </Grid>
    </GridContainer>
  )
}`,
      html: `<div class="grid-container usa-section">
  <div class="grid-row grid-gap">
    <div class="grid-col-12 desktop:grid-col-8">
      <main>
        <!-- Main content -->
      </main>
    </div>
    <div class="grid-col-12 desktop:grid-col-4">
      <aside>
        <!-- Sidebar -->
      </aside>
    </div>
  </div>
</div>`
    },
    responsive: true
  },

  'three-column': {
    name: 'Three Column',
    description: 'Three equal columns for displaying related content',
    useCase: [
      'Feature showcases',
      'Card grids',
      'Product listings',
      'Service offerings'
    ],
    code: {
      react: `import { GridContainer, Grid } from '@trussworks/react-uswds'

export default function Layout({ col1, col2, col3 }) {
  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        <Grid col={12} tablet={{ col: 4 }}>
          {col1}
        </Grid>
        <Grid col={12} tablet={{ col: 4 }}>
          {col2}
        </Grid>
        <Grid col={12} tablet={{ col: 4 }}>
          {col3}
        </Grid>
      </Grid>
    </GridContainer>
  )
}`,
      html: `<div class="grid-container usa-section">
  <div class="grid-row grid-gap">
    <div class="grid-col-12 tablet:grid-col-4">
      <!-- Column 1 -->
    </div>
    <div class="grid-col-12 tablet:grid-col-4">
      <!-- Column 2 -->
    </div>
    <div class="grid-col-12 tablet:grid-col-4">
      <!-- Column 3 -->
    </div>
  </div>
</div>`
    },
    responsive: true
  },

  'dashboard': {
    name: 'Dashboard Grid',
    description: 'Multi-section dashboard layout with varying column widths',
    useCase: [
      'Analytics dashboards',
      'Admin panels',
      'Metrics displays',
      'Data visualizations'
    ],
    code: {
      react: `import { GridContainer, Grid } from '@trussworks/react-uswds'

export default function Dashboard({ stats, chart, table, sidebar }) {
  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        {/* Top stats row */}
        <Grid col={12}>
          <Grid row gap>
            {stats.map((stat, i) => (
              <Grid key={i} col={12} tablet={{ col: 6 }} desktop={{ col: 3 }}>
                {stat}
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Main content */}
        <Grid col={12} desktop={{ col: 8 }}>
          <div className="margin-bottom-3">{chart}</div>
          <div>{table}</div>
        </Grid>

        {/* Sidebar */}
        <Grid col={12} desktop={{ col: 4 }}>
          {sidebar}
        </Grid>
      </Grid>
    </GridContainer>
  )
}`,
      html: `<div class="grid-container usa-section">
  <div class="grid-row grid-gap">
    <!-- Top stats row -->
    <div class="grid-col-12">
      <div class="grid-row grid-gap">
        <div class="grid-col-12 tablet:grid-col-6 desktop:grid-col-3"><!-- Stat 1 --></div>
        <div class="grid-col-12 tablet:grid-col-6 desktop:grid-col-3"><!-- Stat 2 --></div>
        <div class="grid-col-12 tablet:grid-col-6 desktop:grid-col-3"><!-- Stat 3 --></div>
        <div class="grid-col-12 tablet:grid-col-6 desktop:grid-col-3"><!-- Stat 4 --></div>
      </div>
    </div>

    <!-- Main content -->
    <div class="grid-col-12 desktop:grid-col-8">
      <div class="margin-bottom-3"><!-- Chart --></div>
      <div><!-- Table --></div>
    </div>

    <!-- Sidebar -->
    <div class="grid-col-12 desktop:grid-col-4">
      <!-- Sidebar content -->
    </div>
  </div>
</div>`
    },
    responsive: true
  },

  'card-grid': {
    name: 'Card Grid (4 columns)',
    description: 'Responsive grid for displaying cards or tiles',
    useCase: [
      'Product catalogs',
      'Image galleries',
      'Team members',
      'Resource lists'
    ],
    code: {
      react: `import { GridContainer, Grid, Card, CardHeader, CardBody } from '@trussworks/react-uswds'

export default function CardGrid({ items }) {
  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        {items.map((item, i) => (
          <Grid key={i} col={12} tablet={{ col: 6 }} desktop={{ col: 3 }}>
            <Card>
              <CardHeader>
                <h3>{item.title}</h3>
              </CardHeader>
              <CardBody>
                <p>{item.description}</p>
              </CardBody>
            </Card>
          </Grid>
        ))}
      </Grid>
    </GridContainer>
  )
}`,
      html: `<div class="grid-container usa-section">
  <div class="grid-row grid-gap">
    <div class="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
      <div class="usa-card">
        <div class="usa-card__container">
          <div class="usa-card__header">
            <h3 class="usa-card__heading">Card 1</h3>
          </div>
          <div class="usa-card__body">
            <p>Content</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Repeat for more cards -->
  </div>
</div>`
    },
    responsive: true
  },

  'hero-content': {
    name: 'Hero + Content',
    description: 'Full-width hero section followed by content area',
    useCase: [
      'Landing pages',
      'Home pages',
      'Marketing pages',
      'Product pages'
    ],
    code: {
      react: `import { GridContainer, Grid } from '@trussworks/react-uswds'

export default function Layout({ hero, content }) {
  return (
    <>
      {/* Full-width hero */}
      <section className="usa-hero">
        <GridContainer>
          {hero}
        </GridContainer>
      </section>

      {/* Content section */}
      <GridContainer className="usa-section">
        <Grid row gap>
          <Grid col={12} desktop={{ col: 8 }} className="desktop:grid-offset-2">
            {content}
          </Grid>
        </Grid>
      </GridContainer>
    </>
  )
}`,
      html: `<!-- Full-width hero -->
<section class="usa-hero">
  <div class="grid-container">
    <!-- Hero content -->
  </div>
</section>

<!-- Content section -->
<div class="grid-container usa-section">
  <div class="grid-row grid-gap">
    <div class="grid-col-12 desktop:grid-col-8 desktop:grid-offset-2">
      <!-- Main content -->
    </div>
  </div>
</div>`
    },
    responsive: true
  },

  'asymmetric': {
    name: 'Asymmetric (8/4)',
    description: '2/3 main content with 1/3 sidebar',
    useCase: [
      'Blog posts with sidebar',
      'Documentation with TOC',
      'Articles with related content'
    ],
    code: {
      react: `import { GridContainer, Grid } from '@trussworks/react-uswds'

export default function Layout({ main, aside }) {
  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        <Grid col={12} desktop={{ col: 8 }}>
          <main className="usa-prose">
            {main}
          </main>
        </Grid>
        <Grid col={12} desktop={{ col: 4 }}>
          <aside className="desktop:position-sticky desktop:top-2">
            {aside}
          </aside>
        </Grid>
      </Grid>
    </GridContainer>
  )
}`,
      html: `<div class="grid-container usa-section">
  <div class="grid-row grid-gap">
    <div class="grid-col-12 desktop:grid-col-8">
      <main class="usa-prose">
        <!-- Main content -->
      </main>
    </div>
    <div class="grid-col-12 desktop:grid-col-4">
      <aside class="desktop:position-sticky desktop:top-2">
        <!-- Sidebar -->
      </aside>
    </div>
  </div>
</div>`
    },
    responsive: true
  }
};

export const LAYOUT_CATEGORIES = {
  basic: 'Basic Layouts',
  content: 'Content Layouts',
  complex: 'Complex Layouts'
};
