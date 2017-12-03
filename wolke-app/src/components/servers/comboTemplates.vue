<template>
  <select v-model="item.templateId" class="form-control">
  <option v-for="option in items" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
</template>

<script>
  export default {
    props: ['item'],
    data: function () {
      return {
        items: []
      }
    },

    mounted: function () {
      this.update()
    },

    methods: {
      update: function () {
        var self = this
        $.get('/api/v1/templates', function (data) {
          self.items = data.map(d => {
            return {
              value: d._id,
              text: d.name
            }
          })

          self.items.unshift({ value: '', text: 'Select a template' })
        })
      }
    }
  }
</script>
