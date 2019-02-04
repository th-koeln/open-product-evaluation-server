<template>
  <b-row class="footer">
    <b-col sm="6">
      Open Product Evaluation is Open Source.
    </b-col>
    <b-col sm="6">
      <ul>
        <li>
          <a href="https://github.com/th-koeln/open-product-evaluation-server/issues">
            Contact
          </a>
        </li>
        <li>
          <a href="https://github.com/th-koeln/open-product-evaluation-server">
            About
          </a>
        </li>
        <li>
          <a href="https://github.com/th-koeln/open-product-evaluation-server/wiki">
            Help
          </a>
        </li>
      </ul>
    </b-col>
  </b-row>
</template>

<script>
export default {
  Name: 'Footer',
}
</script>

<style scoped="true" lang="scss">

  .footer {
    color: #989898;
    padding: 1.5rem 0 0;

    ul {
      list-style: none;
      float: right;
      margin: 0;
      padding: 0;

      li {
        float: left;
        margin-left: 1em;
      }
    }
  }

  @media(max-width: 575.99px) {
    .footer {
      line-height: 2rem;

      ul {
        float: none;

        li {
          float: none;
          margin: 0;
        }
      }
    }
  }
</style>
