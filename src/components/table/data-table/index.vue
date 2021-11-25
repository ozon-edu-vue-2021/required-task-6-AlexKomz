<script lang="jsx">
import styles from "./style.module.css";

export default {
  name: "DataTable",
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    styles,
    sort: {
      columnName: "",
      direction: "",
    },
    filter: {
      columnName: "",
      text: "",
    },
  }),
  methods: {
    getColumnOptions() {
      return this.$slots.default.map((column) => {
        return Object.assign({}, column.componentOptions.propsData);
      });
    },

    renderHead(h, columnsOptions) {
      const { headerCell } = this.styles;

      return columnsOptions.map((column) => {
        return (
          <th key={`${column.name}_${column.title}`} class={headerCell}>
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
      const { cell } = this.styles;

      return columnsOptions.map((column, index) => {
        return (
          <td key={`${column.name}_${column.title}_${index}`} class={cell}>
            {row[column.name]}
          </td>
        );
      });
    },
  },

  render(h) {
    const { table } = this.styles;

    const columnsOptions = this.getColumnOptions();
    const columnsHead = this.renderHead(h, columnsOptions);
    const rows = this.renderRows(h, columnsOptions);

    return (
      <table class={table}>
        <thead>{...columnsHead}</thead>
        <tbody>{...rows}</tbody>
      </table>
    );
  },
};
</script>
