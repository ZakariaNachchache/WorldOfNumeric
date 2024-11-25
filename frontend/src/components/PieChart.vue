<template>
  <div>
    <!-- Pie Chart -->
    <apexchart
      v-if="chartOptions.labels.length && series.length"
      type="pie"
      :options="chartOptions"
      :series="series"
      class="chart-container"
    />
  </div>
</template>

<script>
import { ref, watch, defineComponent } from "vue";
import ApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "SalesPieChart",
  components: {
    apexchart: ApexCharts,
  },
  props: {
    salesData: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const series = ref([]);
    const chartOptions = ref({
      labels: [],
      colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33A1FF"], // Customize colors
      title: {
        text: "Sales PieChart",
        align: "center",
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
        },
      },
    });

    // Watch props for changes and update chart data
    watch(
      () => props.categories,
      (newCategories) => {
        chartOptions.value.labels = newCategories;
      }
    );

    watch(
      () => props.salesData,
      (newSalesData) => {
        series.value = newSalesData;
      }
    );

    // Initial setup on mounted
    series.value = props.salesData;
    chartOptions.value.labels = props.categories;

    return {
      series,
      chartOptions,
    };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>
