<script>
import styles from "./TableView.module.css";

export default {
  name: "TableView",
  props: {
    tableHead: {
      type: Array,
      required: true,
    },
    tableBody: {
      type: Array,
      required: true,
    },
  },
  render() {
    const { table } = styles;
    const { tableHead, tableBody } = this;

    return (
      <table class={table}>
        <thead>{...tableHead}</thead>
        <tbody>{...tableBody}</tbody>
      </table>
    );
  },
};
</script>
