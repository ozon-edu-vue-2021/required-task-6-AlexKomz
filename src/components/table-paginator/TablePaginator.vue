<script lang="jsx">
import styles from "./TablePaginator.module.css";

export default {
  name: "TablePaginator",
  props: {
    totalPages: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    shownPagesNumbers() {
      const { currentPage, totalPages } = this;

      if (currentPage <= 3) {
        if (totalPages < 5) {
          return Array(totalPages)
            .fill(null)
            .map((index) => index + 1);
        }

        return [1, 2, 3, 4, 5];
      }

      if (currentPage >= totalPages - 2) {
        return [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      }

      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    },
  },
  render() {
    const { shownPagesNumbers, currentPage, totalPages, $listeners } = this;
    const { pagination, control, active } = styles;
    const { getPage } = $listeners;

    return (
      <div class={pagination}>
        <span class={control} onClick={() => getPage(1)}>
          {"<<"}
        </span>
        <span class={control} onClick={() => getPage(currentPage - 1)}>
          {"<"}
        </span>
        {...shownPagesNumbers.map((number) => (
          <span
            class={[control, { [active]: currentPage === number }]}
            onClick={() => getPage(number)}
          >
            {number}
          </span>
        ))}
        <span class={control} onClick={() => getPage(currentPage + 1)}>
          {">"}
        </span>
        <span class={control} onClick={() => getPage(totalPages)}>
          {">>"}
        </span>
      </div>
    );
  },
};
</script>
