<script>
  import {
    Content,
    Grid,
    Row,
    Column,
    RadioButtonGroup,
    RadioButton
  } from 'carbon-components-svelte';

  /** @type import( "carbon-components-svelte/src/Theme/Theme.svelte").CarbonTheme */
  let theme = 'g90';
</script>

<Content>
  <Grid>
    <Row>
      <Column>
        <h2>Theme</h2>
        <section>
          <RadioButtonGroup legendText="Carbon theme" bind:selected={theme}>
            {#each ['white', 'g10', 'g80', 'g90', 'g100'] as value}
              <RadioButton labelText={value} {value} />
            {/each}
          </RadioButtonGroup>
        </section>
      </Column>
    </Row>
  </Grid>
</Content>
