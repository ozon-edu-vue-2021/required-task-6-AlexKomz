<template>
  <div id="app">
    <DataTable
      :rows="rows"
      :current-page="currentPage"
      :total-pages="totalPages"
      :static-paging="false"
      @getPage="infGetPage"
    >
      <TableColumn name="id" title="ID" />
      <TableColumn name="postId" title="Post ID" />
      <TableColumn name="email" title="Email" />
      <TableColumn name="name" title="Name" />
    </DataTable>
  </div>
</template>

<script>
import DataTable from "@/components/data-table/DataTable";
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

    this.blockingPromise = this.getPage(1);
  },
  methods: {
    async getPage(number) {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${number}`
      );
      this.rows = await res.json();
      this.currentPage = number;
    },

    async infGetPage() {
      this.blockingPromise && (await this.blockingPromise);
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${
          this.currentPage + 1
        }`
      );
      const newRows = await res.json();
      this.rows = [...this.rows, ...newRows];
      this.currentPage++;
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
