<template>
  <input
      ref="inputRef"
      :value="formattedValue"
  >
</template>

<script>
import { watch } from 'vue';
import useCurrencyInput from 'vue-currency-input';

const totalInputOptions = {
  display: 'symbol',
  precision: 8,
}

export default {
  name: 'CurrencyInput',
  props: {
    modelValue: Number,
    currency: {
      type: String,
      required: true,
      validator: (value) => value.length === 3 || value.length === 4
    }
  },

  emits: {
    'modelValue:update': undefined,
  },

  setup (props) {
    const { formattedValue, inputRef, setOptions, setValue } = useCurrencyInput({...totalInputOptions, currency: props.currency})

    //updates value when the modelValue prop (supplied through v-model) is updated.
    watch(() => props.modelValue, (value) => {
      setValue(value)
    })

    //updates input config when the currency prop is updated.
    watch(() => props.currency, (currency) => {
      setOptions({...totalInputOptions, currency})
    })

    return { inputRef, formattedValue }
  }
}
</script>