<template>
  <div :class="rootClass">
    <div :class="rootClass + '__wrapper'" class="d-flex justify-content-around">
      <div
        v-for="(dataImage, index) in dataImagesLocal"
        :key="index"
        :class="rootClass + '__item'"
      >
        <div :class="rootClass + '__thumbnail'">
          <img
            :src="dataImage.src"
            :alt="dataImage.alt"
            :height="h"
            :width="w"
            :class="rootClass + '__img'"
          />
        </div>

        <div :class="rootClass + '__lbl'">
          <a :href="dataImage.url" target="_blank">
            <p class="label">{{ dataImage.alt }}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "images-collection",
  props: {
    dataImages: {
      type: Array,
      default: () => []
    },
    rootClass: {
      type: String,
      default: "images-collection"
    },
    h: {
      type: String,
      default: "auto"
    },
    w: {
      type: String,
      default: "auto"
    }
  },
  computed: {
    dataImagesLocal: function() {
      return this.dataImages || [];
    }
  }
};
</script>
