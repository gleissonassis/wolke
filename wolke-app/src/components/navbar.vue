<template>
  <div>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigations</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Wolke</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li ><router-link to="/servers">Servers</router-link></li>
            <li><router-link to="/templates">Templates</router-link></li>
            <li><router-link to="/tasks">Tasks</router-link></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'menu'
}
</script>
