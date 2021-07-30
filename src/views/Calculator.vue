<template>
  <div class="calculator">
    <div class="inputs">
      <div class="input">
        <label>Start Bedrag</label>
        <input type="number" v-model="startAmount"/>
      </div>
      <div class="input">
        <label>Procenten per dag</label>
        <select v-model="percentagePerPeriod">
          <option value="0.5">0,50%</option>
          <option value="1">1,00%</option>
          <option value="1.5">1,50%</option>
          <option value="2">2.00%</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Dag</th>
          <th>Minimale Winst per dag</th>
          <th>Verwachte eindstand account per dag</th>
          <th>Werkelijke eindstand per dag</th>
          <th>Winst of verlies per dag</th>
          <th>Hoeveel % loop je voor of achter</th>
          <th>NOTITIES OF VERWIJZINGEN NAAR JE ORDER DAG  BOEK</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows">
          <td>{{ row }}</td>
          <td>{{ getReturnPerPeriod(row) }}</td>
          <td>{{ getPeriodTotal(row) }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.inputs {
  text-align: left;
  margin-bottom: 20px;

  .input {
    margin-bottom: 10px;
  }

  input,
  select {
    padding: 5px;
  }

  label {
    display: inline-block;
    width: 200px;
  }
}
table {
  th {
    padding: 5px;
  }

  th,
  td {
    border-bottom: 1px solid #333;
    border-left: 1px solid #333;
  }
}
</style>

<script>
let periodTotal = 0;

export default {
  data () {
    return {
      rows: 365,
      startAmount: 670,
      percentagePerPeriod: 1
    }
  },
  watch: {
    startAmount () {
      this.resetValues();
    },
    percentagePerPeriod () {
      this.resetValues();
    }
  },
  beforeMount () {
    this.resetValues();
  },
  methods: {
    getReturnPerPeriod () {
      let value = periodTotal * (this.percentagePerPeriod / 100);

      periodTotal += value;

      return value.toFixed(4);
    },
    getPeriodTotal () {
      return periodTotal.toFixed(4);
    },
    resetValues () {
      periodTotal = this.startAmount;
    }
  }
}
</script>
