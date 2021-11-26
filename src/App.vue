<template>
  <div id="app">
    <DataTable
      :rows="rows"
      :current-page="currentPage"
      :total-pages="totalPages"
      @getPage="getPage"
    >
      <TableColumn name="id" title="ID" />
      <TableColumn name="postId" title="Post ID" />
      <TableColumn name="email" title="Email" />
      <TableColumn name="name" title="Name" />
    </DataTable>
  </div>
</template>

<script>
import DataTable from "@/components/data-table";
import TableColumn from "@/components/TableColumn";

export default {
  name: "App",
  components: { DataTable, TableColumn },
  data: () => ({
    rows: [],
    currentPage: 1,
    totalPages: 1,
  }),
  async created() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
    // this.rows = await res.json();
    this.totalPages = Math.max(
      ...(await res.json()).map((item) => item.postId)
    );

    await this.getPage(this.currentPage);
  },
  methods: {
    async getPage(number) {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${number}`
      );
      this.rows = await res.json();
      this.currentPage = number;
    },
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
