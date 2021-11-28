<script lang="jsx">
import { orderBy } from "lodash";

import styles from "./DataTable.module.css";
import TablePaginator from "@/components/table-paginator/TablePaginator";
import TableLoader from "@/components/table-loader/TableLoader";

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
  components: { TablePaginator, TableLoader },
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    currentPage: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    staticPaging: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    styles,
    sort: {
      columns: [],
    },
    filter: {
      columns: [],
    },
  }),
  computed: {
    sortedRows() {
      let result;

      const sortColumnsFilteredByDirection = this.getNotEmptyColumns(
        this.sort.columns,
        "direction"
      );

      if (!sortColumnsFilteredByDirection.length) {
        result = this.rows;
      }

      const iteratees = sortColumnsFilteredByDirection.map(
        (column) => column.name
      );
      const orders = sortColumnsFilteredByDirection.map(
        (column) => column.direction
      );

      result = orderBy(this.rows, iteratees, orders);

      const filterColumnsFilteredByText = this.getNotEmptyColumns(
        this.filter.columns,
        "text"
      );

      filterColumnsFilteredByText.forEach((column) => {
        result = result.filter((row) =>
          row[column.name].toString().includes(column.text)
        );
      });

      return result;
    },
  },
  methods: {
    getNotEmptyColumns(columns, columnName) {
      return columns.filter((column) => !!column[columnName]);
    },

    getColumn(columns, columnName) {
      return columns.find((column) => column.name === columnName);
    },

    inputHandler(column, value) {
      column.text = value;
    },

    toggleFilterInput(column) {
      if (column.isOpen) {
        column.text = "";
      }

      column.isOpen = !column.isOpen;
    },

    toggleSort(column) {
      column.direction =
        column.direction === direction.DESC || !column.direction
          ? direction.ASC
          : direction.DESC;
    },

    getColumnOptions() {
      return this.$slots.default.map((column) => {
        return Object.assign({}, column.componentOptions.propsData);
      });
    },

    getSortOptions(columnsOptions) {
      return columnsOptions.map((column) => {
        return { name: column.name, direction: "" };
      });
    },

    getFilterOptions(columnOptions) {
      return columnOptions.map((column) => {
        return { name: column.name, text: "", isOpen: false };
      });
    },

    getSortIconClasses(column) {
      const { sortIcon } = this.styles;
      const result = [sortIcon];

      switch (column.direction) {
        case direction.ASC:
          result.push(icon.sort.ASC);
          break;
        case direction.DESC:
          result.push(icon.sort.DESC);
          break;
        default:
          result.push(icon.sort.DEFAULT);
      }

      return result;
    },

    renderHead(h, columnsOptions) {
      const { styles } = this;
      const {
        headerCell,
        headerCellContent,
        filterIcon,
        filterInput,
        filterInputShown,
      } = styles;

      return columnsOptions.map((column) => {
        const sortColumn = this.getColumn(this.sort.columns, column.name);
        const filterColumn = this.getColumn(this.filter.columns, column.name);

        const sortIconClasses = this.getSortIconClasses(sortColumn);
        const filterIconClasses = [filterIcon];
        const filterInputClasses = [filterInput];

        filterIconClasses.push(icon.filter.DEFAULT);

        if (filterColumn.isOpen) {
          filterInputClasses.push(filterInputShown);
        }

        return (
          <th key={`${column.name}_${column.title}`} class={headerCell}>
            <div class={headerCellContent}>
              <i
                class={filterIconClasses.join(" ")}
                onClick={() => this.toggleFilterInput(filterColumn)}
              />
              <span>{column.title}</span>
              <i
                class={sortIconClasses.join(" ")}
                onClick={() => this.toggleSort(sortColumn)}
              />
              <input
                class={filterInputClasses.join(" ")}
                type="text"
                value={filterColumn.text}
                onInput={(event) => {
                  const { value } = event.target;
                  this.inputHandler(filterColumn, value);
                }}
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

    renderInfPager() {
      const { infPager } = this.styles;

      const directives = [
        {
          name: "detect-viewport",
          value: {
            callback: this.$listeners.getPage,
          },
        },
      ];

      return (
        <div {...{ class: infPager, directives }}>
          <TableLoader />
        </div>
      );
    },
  },

  created() {
    const columnOptions = this.getColumnOptions();
    this.sort.columns = this.getSortOptions(columnOptions);
    this.filter.columns = this.getFilterOptions(columnOptions);
  },

  render(h) {
    const { totalPages, currentPage, staticPaging, $listeners } = this;
    const { getPage } = $listeners;
    const { wrapper, table } = this.styles;

    const columnsOptions = this.getColumnOptions();

    const columnsHead = this.renderHead(h, columnsOptions);
    const rows = this.renderRows(h, columnsOptions);

    const hasPagination = !!(totalPages && currentPage && getPage);

    return (
      <div class={wrapper}>
        <table class={table}>
          <thead>{...columnsHead}</thead>
          <tbody>{...rows}</tbody>
        </table>

        {hasPagination &&
          (staticPaging ? (
            <TablePaginator
              totalPages={totalPages}
              currentPage={currentPage}
              on={{ getPage: getPage }}
            />
          ) : (
            this.renderInfPager()
          ))}
      </div>
    );
  },
};
</script>
