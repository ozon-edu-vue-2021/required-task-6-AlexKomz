<script>
export default {
  name: "TableColumn",
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
