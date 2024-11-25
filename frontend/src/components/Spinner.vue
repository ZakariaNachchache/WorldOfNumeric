<template>
  <div>
    <b-spinner
      style="width: 3rem; height: 3rem"
      label="Large Spinner"
    ></b-spinner>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  data() {
    return {
      variants: [
        "primary",
        "secondary",
        "danger",
        "warning",
        "success",
        "info",
        "light",
        "dark",
      ],
    };
  },
};
</script>
