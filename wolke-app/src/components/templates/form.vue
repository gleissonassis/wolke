<template>
  <div>
    <confirm ref="confirm" title="Remove confirmation" message="Are you sure you want delete this item?" @close="closeModalRemoveSchedulingItem" />
    <confirm ref="confirmMain" title="Remove confirmation" message="Are you sure you want delete this template?" @close="closeModalRemoveItem" />

    <div class="panel panel-default">
      <div class="panel-heading ">Template
          <div class="btn-group btn-group-xs pull-right" role="group" aria-label="...">
            <button type="button" class="btn btn-primary" title="Save the template" @click="saveChanges"><span class="glyphicon glyphicon-floppy-disk" /></button>
            <button type="button" class="btn btn-primary" title="Duplicate the template" @click="duplicateItem"><span class="glyphicon glyphicon-share-alt" /></button>
            <button type="button" class="btn btn-primary" title="Remove the template" @click="removeItem"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>
        </div>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" v-model="item.name" id="name" placeholder="Template name">
            </div>
          </div>
          <div class="col-md-12">
            <button class="btn btn-primary" type="submit" title="Add new scheduling" v-on:click="addNewScheduling"><span class="glyphicon glyphicon-plus-sign" /> Add new scheduling</button>
          </div>
          <div class="col-md-12">
            <table class="table">
              <thead>
                <tr>
                  <th>Week day</th>
                  <th>Action</th>
                  <th style="width: 150px">Time</th>
                  <th style="width: 100px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="schedulingItem in item.schedule" :key="item._id">
                  <td>
                    <select class="form-control" v-model="schedulingItem.weekday">
                      <option>Select a value...</option>
                      <option value="0">Sunday</option>
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thurday</option>
                      <option value="5">Friday</option>
                      <option value="6">Starday</option>
                    </select>
                  </td>
                  <td>
                    <select class="form-control" v-model="schedulingItem.command">
                      <option>Select a value...</option>
                      <option value="turnon-server">Turn on server</option>
                      <option value="turnoff-server">Turn off server</option>
                    </select>
                  </td>
                  <td>
                    <div class="form-inline">
                      <input type="number" min="0" max="24" class="form-control" style="width: 60px" v-model="schedulingItem.minute" />
                      :
                      <input type="number" min="0" max="59" class="form-control" style="width: 60px" v-model="schedulingItem.hour"  />
                    </div>
                  </td>
                  <td>
                    <div class="btn-group" role="group" aria-label="...">
                      <button type="button" class="btn btn-default" title="Duplicate this item" v-on:click="duplicateSchedulingItem(schedulingItem)"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></button>
                      <button type="button" class="btn btn-default" title="Remove the template" v-on:click="removeSchedulingItem(schedulingItem)"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-12">
            <div class="pull-right">
              <router-link class="btn btn-default" to="/templates"><span class="glyphicon glyphicon-circle-arrow-left" /> Discard changes</router-link>
              <button type="button" class="btn btn-primary" title="Save the template" v-on:click="saveChanges"><span class="glyphicon glyphicon-floppy-disk" /> Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Confirm from '../util/confirm'

  export default {
    data: function () {
      return {
        item: {}
      }
    },

    components: {
      Confirm
    },

    mounted: function () {
      this.update()
    },

    methods: {
      update () {
        const id = this.$route.params.id
        const self = this

        if (id) {
          $.get('/api/v1/templates/' + id, function (data) {
            self.item = data
          })
        } else {
          this.item = {
            schedule: []
          }
        }
      },

      addNewScheduling () {
        this.item.schedule.push({})
      },

      removeItem: function () {
        this.$refs.confirmMain.show()
      },

      closeModalRemoveItem: function (value) {
        const self = this

        if (value) {
          this.$http.delete('/api/v1/templates/' + this.item._id)
            .then(function (r) {
              if (r.status === 200) {
                self.$notify.success('The template has been removed successfully!')
                self.$router.push({ path: `/templates` })
              }
            })
        }
      },

      duplicateItem: function () {
        const self = this

        delete this.item._id

        this.item.name = `Duplicated from ${this.item.name}`

        this.$http.post('/api/v1/templates', this.item)
          .then(function (r) {
            self.$notify.success('The template has been duplicated successfully!')
            self.$router.push({ path: `/templates/${r.body._id}` })
          }, function (r) {
            self.$notify.danger('An error has occurred while duplicating the template!\n\nStatus code: ' + r.status)
          })
      },

      closeModalRemoveSchedulingItem: function (value) {
        if (value) {
          this.item.schedule = this.item.schedule
            .filter(s => s !== this.currentScheduling)
          this.$notify.success('The item has been removed successfully!')
        }
      },

      removeSchedulingItem (scheduling) {
        this.currentScheduling = scheduling
        this.$refs.confirm.show()
      },

      duplicateSchedulingItem (scheduling) {
        this.item.schedule.push({
          ...scheduling
        })
      },

      saveChanges: function () {
        var self = this
        if (this.item._id) {
          this.$http.put('/api/v1/templates/' + this.item._id, this.item)
          .then(function () {
            self.$notify.success('The template has been updated successfully!')
          }, function (r) {
            self.$notify.danger('An error has occurred while updating the template!\n\nStatus code: ' + r.status)
          })
        } else {
          this.$http.post('/api/v1/templates', this.item)
          .then(function (r) {
            self.item._id = r.body._id
            self.$notify.success('The template has been created successfully!')
          }, function (r) {
            self.$notify.danger('An error has occurred while creating the template!\n\nStatus code: ' + r.status)
          })
        }
      }
    }
  }
</script>
