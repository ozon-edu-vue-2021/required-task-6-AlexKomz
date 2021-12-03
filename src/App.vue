<template>
  <div id="app">
    <button @click="rendered = true">Render</button>
    <!--    <DataTable v-if="rendered" :rows="rows">-->
    <!--      <TableColumn name="id" title="ID" />-->
    <!--      <TableColumn name="postId" title="Post ID" />-->
    <!--      <TableColumn name="email" title="Email" />-->
    <!--      <TableColumn name="name" title="Name" />-->
    <!--    </DataTable>-->
    <RecycleScroller
      v-if="rendered"
      class="scroller"
      :items="rows"
      :item-size="55"
      :buffer="2000"
      page-mode
      key-field="id"
      v-slot="{ item }"
    >
      <Item :item="item" />
    </RecycleScroller>
  </div>
</template>

<script>
// import DataTable from "@/components/data-table/DataTable";
// import TableColumn from "@/components/TableColumn";
import Item from "@/components/virtual-scroll/item";

export default {
  name: "App",
  // components: { DataTable, TableColumn },
  components: { Item },
  data: () => ({
    rendered: false,
    rows: [],
    currentPage: 1,
    totalPages: 1,
  }),
  async created() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
    this.rows = await res.json();

    // this.totalPages = Math.max(
    //   ...(await res.json()).map((item) => item.postId)
    // );
    // this.blockingPromise = this.getPage(1);
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

<style scoped>
.scroller {
  text-align: left;
  margin: 24px;
}
</style>
