<script>
  import {
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
    <Row><h2>Settings</h2></Row>

    <Row>
      <RadioButtonGroup legendText="Carbon theme" bind:selected={theme}>
        {#each ['white', 'g10', 'g80', 'g90', 'g100'] as value}
          <RadioButton labelText={value} {value} />
        {/each}
      </RadioButtonGroup>
    </Row>
  </Grid>
</Content>
