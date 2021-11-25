<script lang="jsx">
import { orderBy } from "lodash";

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
  computed: {
    sortedRows() {
      let result;

      if (!this.sort.columnName) {
        result = this.rows;
      }

      result = orderBy(
        this.rows,
        [this.sort.columnName],
        [this.sort.direction]
      );

      return result;
    },
  },
  methods: {
    toggleSort(columnName) {
      this.sort.columnName = columnName;
      this.sort.direction =
        this.sort.direction === "desc" || !this.sort.direction ? "asc" : "desc";
    },

    getColumnOptions() {
      return this.$slots.default.map((column) => {
        return Object.assign({}, column.componentOptions.propsData);
      });
    },

    renderHead(h, columnsOptions) {
      const { styles, sort } = this;
      const { headerCell, headerCellContent, sortIcon } = styles;

      return columnsOptions.map((column) => {
        const sortIconClasses = [sortIcon];

        if (sort.columnName === column.name) {
          sortIconClasses.push("fad");
          sortIconClasses.push(
            sort.direction === "asc"
              ? "fa-sort-amount-down"
              : "fa-sort-amount-up"
          );
        } else {
          sortIconClasses.push("fas");
          sortIconClasses.push("fa-sort");
        }

        return (
          <th key={`${column.name}_${column.title}`} class={headerCell}>
            <div class={headerCellContent}>
              <span>{column.title}</span>
              <li
                class={sortIconClasses.join(" ")}
                onClick={() => this.toggleSort(column.name)}
              />
            </div>
          </th>
        );
      });
    },

    renderRows(h, columnsOptions) {
      return this.sortedRows.map((row) => {
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
