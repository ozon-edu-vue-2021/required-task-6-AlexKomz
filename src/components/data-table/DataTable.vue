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
    columns: [],
  }),
  computed: {
    columnsWithSort() {
      return this.columns.reduce((acc, column) => {
        const { sort } = column;

        if (sort.direction) {
          acc.push({ name: column.name, direction: sort.direction });
        }

        return acc;
      }, []);
    },

    columnsWithFilter() {
      return this.columns.reduce((acc, column) => {
        const { filter } = column;

        if (filter.text) {
          acc.push({ name: column.name, text: filter.text });
        }

        return acc;
      }, []);
    },

    sortedRows() {
      let result;

      if (!this.columnsWithSort.length) {
        result = this.rows;
      }

      const iterates = this.columnsWithSort.map((column) => column.name);
      const orders = this.columnsWithSort.map((column) => column.direction);

      result = orderBy(this.rows, iterates, orders);

      this.columnsWithFilter.forEach((column) => {
        result = result.filter((row) =>
          row[column.name].toString().includes(column.text)
        );
      });

      return result;
    },
  },
  methods: {
    inputHandler(filter, value) {
      filter.text = value;
    },

    toggleFilterInput(filter) {
      if (filter.isOpen) {
        filter.text = "";
      }

      filter.isOpen = !filter.isOpen;
    },

    toggleSort(sort) {
      sort.direction =
        sort.direction === direction.DESC || !sort.direction
          ? direction.ASC
          : direction.DESC;
    },

    getColumnOptions() {
      return this.$slots.default.map((column) => {
        const template = {
          sort: { direction: "" },
          filter: { text: "", isOpen: false },
        };
        return Object.assign(template, column.componentOptions.propsData);
      });
    },

    getSortIconClasses(sort) {
      const { sortIcon } = styles;
      const result = [sortIcon];

      switch (sort.direction) {
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

    renderHead() {
      const {
        headerCell,
        headerCellContent,
        filterIcon,
        filterInput,
        filterInputShown,
      } = styles;

      return this.columns.map((column) => {
        const sortIconClasses = this.getSortIconClasses(column.sort);
        const filterIconClasses = [filterIcon];
        const filterInputClasses = [filterInput];

        filterIconClasses.push(icon.filter.DEFAULT);

        if (column.filter.isOpen) {
          filterInputClasses.push(filterInputShown);
        }

        return (
          <th key={`${column.name}_${column.title}`} class={headerCell}>
            <div class={headerCellContent}>
              <i
                class={filterIconClasses.join(" ")}
                onClick={() => this.toggleFilterInput(column.filter)}
              />
              <span>{column.title}</span>
              <i
                class={sortIconClasses.join(" ")}
                onClick={() => this.toggleSort(column.sort)}
              />
              <input
                class={filterInputClasses.join(" ")}
                type="text"
                value={column.filter.text}
                onInput={(event) => {
                  const { value } = event.target;
                  this.inputHandler(column.filter, value);
                }}
              />
            </div>
          </th>
        );
      });
    },

    renderRows() {
      return this.sortedRows.map((row) => {
        return <tr key={row.id}>{...this.renderColumns(row, this.columns)}</tr>;
      });
    },

    renderColumns(row, columnsOptions) {
      const { cell } = styles;

      return columnsOptions.map((column, index) => {
        return (
          <td key={`${column.name}_${column.title}_${index}`} class={cell}>
            {row[column.name]}
          </td>
        );
      });
    },

    renderInfPager() {
      const { infPager } = styles;

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
    this.columns = this.getColumnOptions();
  },

  render() {
    const { totalPages, currentPage, staticPaging, $listeners } = this;
    const { getPage } = $listeners;
    const { wrapper, table } = styles;

    const columnsHead = this.renderHead();
    const rows = this.renderRows();

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
