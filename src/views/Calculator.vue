<template>
  <div class="calculator">
    <div class="calculator__intro">
      <div class="calculator">
        <div class="calculator__start-amount">
          <label>Start Bedrag</label>
          <CurrencyInput v-model="startAmount" :currency="currency"></CurrencyInput>
        </div>
      </div>
      <div class="calculator__percentage">
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
        <th>NOTITIES OF VERWIJZINGEN NAAR JE ORDER DAG BOEK</th>
      </tr>
      </thead>
      <tbody class="wrapper">
      <tr v-for="row in rows">
        <td>{{ row }}</td>
        <td class="minimal-profit">{{ getReturnPerPeriod(row) }}</td>
        <td class="expected-total">{{ getPeriodTotal(row) }}</td>
        <td class="real-total">
          <RealTotal :currency="currency"></RealTotal>
        </td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import CurrencyInput from '@/components/CurrencyInput.vue';
import RealTotal from '@/components/RealTotal.vue';

let periodTotal = 0;
let startAmount = 0.0179;

export default {
  components: {
    CurrencyInput,
    RealTotal
  },

  data() {
    return {
      rows: 365,
      startAmount: startAmount,
      percentagePerPeriod: 1,
      currency: 'BTC',
    }
  },

  watch: {
    startAmount() {
      this.resetValues();
    },
    percentagePerPeriod() {
      this.resetValues();
    }
  },
  beforeMount() {
    this.resetValues();
  },
  methods: {
    getReturnPerPeriod() {
      let value = periodTotal * (this.percentagePerPeriod / 100);

      periodTotal += value;

      return value.toFixed(10);
    },
    getPeriodTotal() {
      return periodTotal.toFixed(10);
    },
    resetValues() {
      periodTotal = this.startAmount;
    }
  }
}
</script>

<style lang="scss">
.calculator {
  &__intro {
    text-align: left;
    margin-bottom: 20px;
  }

  &__start-amount {
    margin-bottom: 10px;
  }

  label {
    display: inline-block;
    width: 200px;
  }

  input,
  select {
    padding: 5px;
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