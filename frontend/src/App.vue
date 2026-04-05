<template>
  <div id="app">
    <header class="app-header">
      <h1>SkyVoyage</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/flights">Flights</router-link>
        <router-link to="/bookings">My Bookings</router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
}

.app-header nav {
  display: flex;
  gap: 1rem;
}

.app-header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.app-header nav a:hover {
  background-color: rgba(255,255,255,0.2);
}

.app-main {
  padding: 2rem;
  min-height: calc(100vh - 200px);
}
</style>
