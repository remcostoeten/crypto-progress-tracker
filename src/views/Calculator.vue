<template>
  <div>
    <OptionSection
        v-model="exportValueAsInteger"
        label="Export Value As Integer"
        description="Whether the number value should be exported as integer instead of a float value depending on the configured precision."
    />
    test
  </div>
  <H2>TEST</H2>
</template>

<script>
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import CurrencyInput from '@/components/CurrencyInput.vue'
import Dialog from '@/components/Dialog.vue'
import stringifyObject from 'stringify-object'
import OptionSection from '@/components/OptionSection.vue';
import Checkbox from '@/components/Checkbox.vue';
import Slider from '@/components/Slider.vue';

export default defineComponent({
  name: 'Demo',
  components: { Slider, Checkbox, OptionSection, Dialog, CurrencyInput },
  setup() {
    const state: any = reactive({
      exportDialogVisible: false,
      value: 1234.5,
      localeEnabled: false,
      locale: 'de-DE',
      locales: ['de-DE', 'de-CH', 'en-US', 'en-IN', 'nl-NL', 'sv-SE', 'fr-FR', 'es-ES', 'pt-PT', 'pt-BR', 'zh-ZH', 'ja-JP', 'ar-SA', 'fa-IR'],
      currency: 'EUR',
      currencyDisplay: 'symbol',
      currencies: ['EUR', 'USD', 'JPY', 'GBP', 'BRL', 'INR', 'CNY', 'JPY', 'SAR', 'IRR'],
      currencyDisplays: [
        { value: 'symbol', label: 'Symbol' },
        { value: 'narrowSymbol', label: 'Narrow symbol' },
        { value: 'code', label: 'Code' },
        { value: 'name', label: 'Name' },
        { value: 'hidden', label: 'Hidden' }
      ],
      hideCurrencySymbolOnFocus: true,
      hideGroupingSeparatorOnFocus: true,
      hideNegligibleDecimalDigitsOnFocusEnabled: true,
      hideNegligibleDecimalDigitsOnFocus: true,
      precisionEnabled: false,
      precision: 2,
      valueRangeEnabled: false,
      minValue: undefined,
      maxValue: undefined,
      autoDecimalDigitsEnabled: true,
      autoDecimalDigits: false,
      exportValueAsInteger: false,
      autoSign: true,
      useGrouping: true,
      options: computed(() => {
        return {
          locale: state.localeEnabled ? state.locale : undefined,
          currency: state.currency,
          currencyDisplay: state.currencyDisplay,
          valueRange: state.valueRangeEnabled ? { min: state.minValue, max: state.maxValue } : undefined,
          precision: state.precisionEnabled ? state.precision : undefined,
          hideCurrencySymbolOnFocus: state.hideCurrencySymbolOnFocus,
          hideGroupingSeparatorOnFocus: state.hideGroupingSeparatorOnFocus,
          hideNegligibleDecimalDigitsOnFocus: state.hideNegligibleDecimalDigitsOnFocus,
          autoDecimalDigits: state.autoDecimalDigits,
          exportValueAsInteger: state.exportValueAsInteger,
          autoSign: state.autoSign,
          useGrouping: state.useGrouping
        }
      }),
      stringifiedOptions: computed(() => stringifyObject(state.options))
    })

    watch(
        () => state.autoDecimalDigits,
        (value) => {
          state.hideNegligibleDecimalDigitsOnFocusEnabled = !value
          state.hideNegligibleDecimalDigitsOnFocus = !value
        }
    )

    return toRefs(state)
  }
})

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