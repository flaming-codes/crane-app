<script>
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody
  } from 'carbon-components-svelte';
</script>

<StructuredList>
  <StructuredListHead>
    <StructuredListRow head>
      <StructuredListCell head>Column A</StructuredListCell>
      <StructuredListCell head>Column B</StructuredListCell>
      <StructuredListCell head>Column C</StructuredListCell>
    </StructuredListRow>
  </StructuredListHead>
  <StructuredListBody>
    <StructuredListRow>
      <StructuredListCell noWrap>Row 1</StructuredListCell>
      <StructuredListCell>Row 1</StructuredListCell>
      <StructuredListCell>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor
        sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus
        dolor. Pellentesque vulputate nisl a porttitor interdum.
      </StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell noWrap>Row 2</StructuredListCell>
      <StructuredListCell>Row 2</StructuredListCell>
      <StructuredListCell>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor
        sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus
        dolor. Pellentesque vulputate nisl a porttitor interdum.
      </StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell noWrap>Row 3</StructuredListCell>
      <StructuredListCell>Row 3</StructuredListCell>
      <StructuredListCell>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor
        sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus
        dolor. Pellentesque vulputate nisl a porttitor interdum.
      </StructuredListCell>
    </StructuredListRow>
  </StructuredListBody>
</StructuredList>
