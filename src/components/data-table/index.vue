<script lang="jsx">
import { orderBy } from "lodash";

import styles from "./style.module.css";

const direction = {
  ASC: "asc",
  DESC: "desc",
};

const icon = {
  sort: {
    DEFAULT: "fas fa-sort",
    ASC: "fad fa-sort-amount-down",
    DESC: "fad fa-sort-amount-up",
  },
  filter: {
    DEFAULT: "fas fa-filter",
  },
};

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

      if (this.filter.text) {
        result = result.filter((row) =>
          row[this.filter.columnName].includes(this.filter.text)
        );
      }

      return result;
    },
  },
  methods: {
    inputHandler(event) {
      this.filter.text = event.target.value;
    },

    openFilterInput(columnName) {
      this.filter.columnName = columnName;
      this.filter.text = "";
    },

    toggleSort(columnName) {
      this.sort.columnName = columnName;
      this.sort.direction =
        this.sort.direction === direction.DESC || !this.sort.direction
          ? direction.ASC
          : direction.DESC;
    },

    getColumnOptions() {
      return this.$slots.default.map((column) => {
        return Object.assign({}, column.componentOptions.propsData);
      });
    },

    getSortIconClasses(columnName) {
      const { sortIcon } = this.styles;
      const result = [sortIcon];

      if (this.sort.columnName === columnName) {
        result.push(
          this.sort.direction === direction.ASC ? icon.sort.ASC : icon.sort.DESC
        );
      } else {
        result.push(icon.sort.DEFAULT);
      }

      return result;
    },

    renderHead(h, columnsOptions) {
      const { styles, filter } = this;
      const {
        headerCell,
        headerCellContent,
        filterIcon,
        filterInput,
        filterInputShown,
      } = styles;

      return columnsOptions.map((column) => {
        const sortIconClasses = this.getSortIconClasses(column.name);
        const filterIconClasses = [filterIcon];
        const filterInputClasses = [filterInput];

        filterIconClasses.push(icon.filter.DEFAULT);

        if (filter.columnName === column.name) {
          filterInputClasses.push(filterInputShown);
        }

        return (
          <th key={`${column.name}_${column.title}`} class={headerCell}>
            <div class={headerCellContent}>
              <i
                class={filterIconClasses.join(" ")}
                onClick={() => this.openFilterInput(column.name)}
              />
              <span>{column.title}</span>
              <i
                class={sortIconClasses.join(" ")}
                onClick={() => this.toggleSort(column.name)}
              />
              <input
                class={filterInputClasses.join(" ")}
                type="text"
                value={filter.text}
                onInput={this.inputHandler}
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
