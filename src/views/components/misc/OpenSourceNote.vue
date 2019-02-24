<template>
  <b-row class="footer">
    <b-col sm="6">
      Open Product Evaluation is Open Source.
    </b-col>
    <b-col sm="6">
      <ul class="footer__list">
        <li class="footer__item">
          <a href="https://github.com/th-koeln/open-product-evaluation-server/issues">
            Contact
          </a>
        </li>
        <li class="footer__item">
          <a href="https://github.com/th-koeln/open-product-evaluation-server">
            About
          </a>
        </li>
        <li class="footer__item">
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

    .footer__list {
      list-style: none;
      float: right;
      margin: 0;
      padding: 0;

      .footer__item {
        float: left;
        margin-left: 1em;
      }
    }
  }

  @media(max-width: 575.99px) {
    .footer {
      line-height: 2rem;

      .footer__list {
        float: none;

        .footer__item {
          float: none;
          margin: 0;
        }
      }
    }
  }
  
  @media print {
    .footer {
      display: none;
    }
  }
</style>
