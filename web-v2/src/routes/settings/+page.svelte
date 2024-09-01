<script>
  import {
    Breadcrumb,
    BreadcrumbItem,
    Column,
    Content,
    Grid,
    RadioButton,
    RadioButtonGroup,
    Row,
    Theme
  } from 'carbon-components-svelte';

  /** @type import( "carbon-components-svelte/src/Theme/Theme.svelte").CarbonTheme */
  let theme = 'g90';
</script>

<Theme persist persistKey="__carbon-theme" bind:theme />

<Content>
  <Grid>
    <Row>
      <Column>
        <h1 class="text">Settings</h1>

        <p>This is a settings page. You can change your preferences here.</p>
      </Column>
    </Row>
    <Row>
      <Column>
        <Breadcrumb>
          <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Annual reports</BreadcrumbItem>
        </Breadcrumb>
      </Column>
    </Row>

    <Row>
      <Column>
        <RadioButtonGroup legendText="Carbon theme" bind:selected={theme}>
          {#each ['white', 'g10', 'g80', 'g90', 'g100'] as value}
            <RadioButton labelText={value} {value} />
          {/each}
        </RadioButtonGroup>
      </Column>
    </Row>
  </Grid>
</Content>

<style lang="scss">
  @use '@carbon/type';

  .text {
    @include type.type-style('heading-07');
  }
</style>
