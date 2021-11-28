<script>
import styles from "./TableView.module.css";

export default {
  name: "TableView",
  functional: true,
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
  render: (h, context) => {
    const { table } = styles;
    const { tableHead, tableBody } = context.props;

    return (
      <table class={table}>
        <thead>{...tableHead}</thead>
        <tbody>{...tableBody}</tbody>
      </table>
    );
  },
};
</script>
