<template>
  <div class="empty">
    <b-card v-if="show && card"
            class="empty__content">
      <div class="empty__icon">
        <font-awesome-icon :icon="icon"
                           size="6x" />
      </div>
      <h4 class="empty__headline">
        {{ headline }}
      </h4>
      <p class="empty__description">
        {{ description }}
      </p>
      <p v-if="!link === null"
         class="empty__link">
        <a v-if="externalLink(link)"
           :href="link"
           class="btn btn-link">
          {{ linkText }}
        </a>
        <router-link v-else
                     :to="{ path: link }">
          {{ linkText }}
        </router-link>
      </p>
    </b-card>

    <div v-if="show && !card"
         class="empty__content">
      <div class="empty__icon">
        <font-awesome-icon :icon="icon"
                           size="6x" />
      </div>
      <h4 class="empty__headline">
        {{ headline }}
      </h4>
      <p class="empty__description">
        {{ description }}
      </p>
      <p v-if="!link === null"
         class="empty__link">
        <a v-if="externalLink(link)"
           :href="link"
           class="btn btn-link">
          {{ linkText }}
        </a>
        <router-link v-else
                     :to="{ path: link }">
          {{ linkText }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    card: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    icon: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      default: 'No items yet',
    },
    description: {
      type: String,
      default: 'Start to add items now',
    },
    link: {
      type: String,
      required: false,
      default: null,
    },
    linkText: {
      type: String,
      required: false,
      default: null,
    }
  },
  methods: {
    externalLink(link) {
      if (link.startsWith('http') || link.startsWith('https')) {
        return true
      }
      return false
    },
  },
}
</script>

<style lang="scss" scoped>

  .empty {
    text-align: center;

    .empty__icon {
      color: $primaryColor;
      margin-bottom: $marginDefault;
    }

    .empty__description {
      color: $secondaryColor;
    }
  }
</style>

