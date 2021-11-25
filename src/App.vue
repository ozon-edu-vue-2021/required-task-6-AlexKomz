<template>
  <div id="app">
    <DataTable :rows="rows">
      <TableColumn name="id" title="ID" />
      <TableColumn name="postId" title="Post ID" />
      <TableColumn name="email" title="Email" />
      <TableColumn name="name" title="Name" />
    </DataTable>
  </div>
</template>

<script>
import DataTable from "@/components/table/data-table";
import TableColumn from "@/components/table/TableColumn";

export default {
  name: "App",
  components: { DataTable, TableColumn },
  data() {
    return {
      rows: [],
    };
  },
  async created() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
    this.rows = await res.json();
  },
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
