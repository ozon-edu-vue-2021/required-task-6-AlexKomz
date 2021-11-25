<script lang="jsx">
export default {
  name: "DataTable",
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getColumnOptions() {
      return this.$slots.default.map((column) => {
        return Object.assign({}, column.componentOptions.propsData);
      });
    },

    renderHead(h, columnsOptions) {
      return columnsOptions.map((column) => {
        return (
          <th
            key={`${column.name}_${column.title}`}
            class={this.$style.headerCell}
          >
            {column.title}
          </th>
        );
      });
    },

    renderRows(h, columnsOptions) {
      return this.rows.map((row) => {
        return (
          <tr key={row.id}>{...this.renderColumns(h, row, columnsOptions)}</tr>
        );
      });
    },

    renderColumns(h, row, columnsOptions) {
      return columnsOptions.map((column, index) => {
        return (
          <td
            key={`${column.name}_${column.title}_${index}`}
            class={this.$style.cell}
          >
            {row[column.name]}
          </td>
        );
      });
    },
  },
  render(h) {
    const columnsOptions = this.getColumnOptions();
    const columnsHead = this.renderHead(h, columnsOptions);
    const rows = this.renderRows(h, columnsOptions);

    return (
      <table class={this.$style.table}>
        <thead>{...columnsHead}</thead>
        <tbody>{...rows}</tbody>
      </table>
    );
  },
};
</script>

<style module>
.table {
  border-spacing: 0;
  width: 100%;
}

.cell {
  text-align: left;
  border-bottom: 1px solid #c8cacc;
  padding: 1rem 1rem;
}

.headerCell {
  composes: cell;
  background: #c7cbcb;
}
</style>
