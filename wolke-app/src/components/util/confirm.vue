<template>
  <div class="modal" ref="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">{{ title }}</h4>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" @click="closeModalCancel">Cancel</button>
        <button type="button" class="btn btn-primary" @click="closeModalOk">Ok</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    props: ['message', 'title'],
    methods: {
      show: function () {
        $(this.$refs.modal).modal('show')
      },

      closeModalOk: function () {
        $(this.$refs.modal).modal('hide')
        this.$emit('close', true)
      },

      closeModalCancel: function () {
        $(this.$refs.modal).modal('hide')
        this.$emit('close', false)
      }
    }
  }
</script>
