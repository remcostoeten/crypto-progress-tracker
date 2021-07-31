<template>
  <div class="grid gap-y-4 md:grid-cols-2 md:gap-x-8 items-center my-8">
    <CurrencyInput
        v-model="value"
        :options="options"
        class="block w-full transition-all rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
    />
    <div>
      Number value: <code class="ml-2">{{ value != null ? value : 'null' }}</code>
    </div>
  </div>
  <div class="flex items-center justify-between mb-2">
    <span class="text-2xl font-bold">Options</span>
    <div>
      <button
          class="transition-all bg-white hover:bg-gray-100 text-gray-800 font-semibold text-sm py-2 px-4 border border-gray-300 rounded shadow focus:outline-none focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          @click="exportDialogVisible = true"
      >
        Export
      </button>
      <Dialog v-model="exportDialogVisible">
        <pre class="white--text m-0" style="margin: 0">{{ stringifiedOptions }}</pre>
      </Dialog>
    </div>
  </div>
  <hr class="mb-8" />
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
    <div>
      <OptionSection v-model="localeEnabled" label="Locale">
        <select
            v-model="locale"
            :disabled="!localeEnabled"
            class="cursor-pointer transition-all w-full shadow-sm disabled:(cursor-not-allowed border-gray-300 text-gray-300) rounded-md text-base focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-50"
        >
          <option v-for="locale in locales" :key="locale">{{ locale }}</option>
        </select>
      </OptionSection>
      <OptionSection label="Currency">
        <select
            v-model="currency"
            class="cursor-pointer w-full shadow-sm not-disabled:( rounded-lg text-base focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-50"
        >
          <option v-for="currency in currencies" :key="currency">{{ currency }}</option>
        </select>
      </OptionSection>
      <OptionSection label="Currency Display" description="How to display the currency in the formatting.">
        <select
            v-model="currencyDisplay"
            class="cursor-pointer w-full shadow-sm not-disabled:( rounded-lg text-base focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-50"
        >
          <option v-for="currencyDisplay in currencyDisplays" :key="currencyDisplay.value" :value="currencyDisplay.value">{{ currencyDisplay.label }}</option>
        </select>
      </OptionSection>
      <OptionSection v-model="useGrouping" label="Use Grouping" description="Whether to use grouping separators such as thousands/lakh/crore separators." />
      <OptionSection label="Distraction Free Input" description="Hide various parts of the formatting on focus for easier input.">
        <Checkbox v-model="hideCurrencySymbolOnFocus" label="Hide currency symbol" class="mb-1" />
        <Checkbox v-model="hideGroupingSeparatorOnFocus" label="Hide grouping separator" class="mb-1" />
        <Checkbox v-model="hideNegligibleDecimalDigitsOnFocus" :disabled="!hideNegligibleDecimalDigitsOnFocusEnabled" label="Hide negligible decimal digits" />
      </OptionSection>
    </div>
    <div>
      <OptionSection
          v-model="autoSign"
          label="Auto Sign"
          description="Whether the minus symbol is automatically inserted or prevented to be inputted depending the current value range."
      />
      <OptionSection
          v-model="valueRangeEnabled"
          label="Value Range"
          description="The validation is triggered on blur and automatically sets the respective threshold if out of range."
      >
        <div class="flex items-center space-x-4">
          <input
              v-model.number="minValue"
              :disabled="!valueRangeEnabled"
              type="number"
              placeholder="Min"
              class="min-w-0 flex-1 shadow-sm disabled:(opacity-50 cursor-not-allowed) rounded-md text-base focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-50"
          />
          <span class="text-center">to</span>
          <input
              v-model.number="maxValue"
              :disabled="!valueRangeEnabled"
              type="number"
              placeholder="Max"
              class="min-w-0 flex-1 shadow-sm disabled:(opacity-50 cursor-not-allowed) rounded-md text-base focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-50"
          />
        </div>
      </OptionSection>
      <OptionSection
          v-model="precisionEnabled"
          label="Precision"
          description="Override the number of displayed decimal digits. Can only be applied for currencies that support decimal digits."
      >
        <div class="flex items-center">
          <Slider v-model.number="precision" :disabled="!precisionEnabled" />
          <code :value="precision" class="w-10 ml-4 text-center"> {{ precision }}</code>
        </div>
      </OptionSection>
      <OptionSection
          v-model="autoDecimalDigits"
          label="Auto Decimal Digits"
          description="Whether the decimal symbol is inserted automatically, using the last inputted digits as decimal digits."
      />
      <OptionSection
          v-model="exportValueAsInteger"
          label="Export Value As Integer"
          description="Whether the number value should be exported as integer instead of a float value depending on the configured precision."
      />
    </div>
  </div>
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
    const state = reactive({
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
:root {
  --c-white: #ffffff;
  --c-white-dark: #f8f8f8;
  --c-black: #000000;
  --c-divider-light: rgba(60, 60, 67, 0.12);
  --c-divider-dark: rgba(84, 84, 88, 0.48);
  --c-text-light-1: #2c3e50;
  --c-text-light-2: #476582;
  --c-text-light-3: #90a4b7;
  --c-brand: #3eaf7c;
  --c-brand-light: #4abf8a;
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-family-mono: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  --z-index-navbar: 10;
  --z-index-sidebar: 6;
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-2: 0 3px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.07);
  --shadow-3: 0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08);
  --shadow-4: 0 14px 44px rgba(0, 0, 0, 0.12), 0 3px 9px rgba(0, 0, 0, 0.12);
  --shadow-5: 0 18px 56px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.16);
  --header-height: 3.6rem;
  --c-divider: var(--c-divider-light);
  --c-text: var(--c-text-light-1);
  --c-text-light: var(--c-text-light-2);
  --c-text-lighter: var(--c-text-light-3);
  --c-bg: var(--c-white);
  --c-bg-accent: var(--c-white-dark);
  --code-line-height: 24px;
  --code-font-family: var(--font-family-mono);
  --code-font-size: 14px;
  --code-inline-bg-color: rgba(27, 31, 35, 0.05);
  --code-bg-color: #282c34
}

*,
::after,
::before {
  box-sizing: border-box
}

html {
  line-height: 1.4;
  font-size: 16px;
  -webkit-text-size-adjust: 100%
}

body {
  margin: 0;
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
  line-height: 1.4;
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: 400;
  color: var(--c-text);
  background-color: var(--c-bg);
  direction: ltr;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale
}

main {
  display: block
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  line-height: 1.25
}

b,
h1,
h2,
h3,
h4,
h5,
h6,
strong {
  font-weight: 600
}

h1:focus .header-anchor,
h1:hover .header-anchor,
h2:focus .header-anchor,
h2:hover .header-anchor,
h3:focus .header-anchor,
h3:hover .header-anchor,
h4:focus .header-anchor,
h4:hover .header-anchor,
h5:focus .header-anchor,
h5:hover .header-anchor,
h6:focus .header-anchor,
h6:hover .header-anchor {
  opacity: 1
}

h1 {
  margin-top: 1.5rem;
  font-size: 1.9rem
}

h2 {
  margin-top: 2.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--c-divider);
  padding-bottom: .3rem;
  line-height: 1.25;
  font-size: 1.65rem
}

h2+h3 {
  margin-top: 1.5rem
}

h3 {
  margin-top: 2rem;
  font-size: 1.35rem
}

h4 {
  font-size: 1.15rem
}

ol,
p,
ul {
  margin: 1rem 0;
  line-height: 1.7
}

[role=button],
a,
area,
button,
input,
label,
select,
summary,
textarea {
  touch-action: manipulation
}

a {
  text-decoration: none;
  color: var(--c-brand)
}

a:hover {
  text-decoration: underline
}

a.header-anchor {
  float: left;
  margin-top: .125em;
  margin-left: -.87em;
  padding-right: .23em;
  font-size: .85em;
  opacity: 0
}

a.header-anchor:focus,
a.header-anchor:hover {
  text-decoration: none
}

figure {
  margin: 0
}

img {
  max-width: 100%
}

ol,
ul {
  padding-left: 1.25em
}

li>ol,
li>ul {
  margin: 0
}

table {
  display: block;
  border-collapse: collapse;
  margin: 1rem 0;
  overflow-x: auto
}

tr {
  border-top: 1px solid #dfe2e5
}

tr:nth-child(2n) {
  background-color: #f6f8fa
}

td,
th {
  border: 1px solid #dfe2e5;
  padding: .6em 1em
}

blockquote {
  margin: 1rem 0;
  border-left: .2rem solid #dfe2e5;
  padding: .25rem 0 .25rem 1rem;
  font-size: 1rem;
  color: #999
}

blockquote>p {
  margin: 0
}

form {
  margin: 0
}

.theme.sidebar-open .sidebar-mask {
  display: block
}

.theme.no-navbar>h1,
.theme.no-navbar>h2,
.theme.no-navbar>h3,
.theme.no-navbar>h4,
.theme.no-navbar>h5,
.theme.no-navbar>h6 {
  margin-top: 1.5rem;
  padding-top: 0
}

.theme.no-navbar aside {
  top: 0
}

.sidebar-mask {
  position: fixed;
  z-index: 2;
  display: none;
  width: 100vw;
  height: 100vh
}

@media screen and (min-width:420px) {
  h1 {
    font-size: 2.2rem
  }
}

@media screen and (min-width:720px) {
  .theme.no-sidebar aside {
    display: none
  }
  .theme.no-sidebar main {
    margin-left: 0
  }
}

code {
  margin: 0;
  border-radius: 3px;
  padding: .25rem .5rem;
  font-family: var(--code-font-family);
  font-size: .85em;
  color: var(--c-text-light);
  background-color: var(--code-inline-bg-color)
}

code .token.deleted {
  color: #ec5975
}

code .token.inserted {
  color: var(--c-brand)
}

div[class*=language-] {
  position: relative;
  margin: 1rem -1.5rem;
  background-color: var(--code-bg-color);
  overflow-x: auto
}

li>div[class*=language-] {
  border-radius: 6px 0 0 6px;
  margin: 1rem -1.5rem 1rem -1.25rem
}

[class*=language-] code,
[class*=language-] pre {
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none
}

[class*=language-] pre {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 1.25rem 1.5rem;
  background: 0 0;
  overflow-x: auto
}

[class*=language-] code {
  padding: 0;
  line-height: var(--code-line-height);
  font-size: var(--code-font-size);
  color: #eee
}

.highlight-lines {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  padding: 1.25rem 0;
  width: 100%;
  line-height: var(--code-line-height);
  font-family: var(--code-font-family);
  font-size: var(--code-font-size);
  user-select: none;
  overflow: hidden
}

.highlight-lines .highlighted {
  background-color: rgba(0, 0, 0, .66)
}

div[class*=language-].line-numbers-mode {
  padding-left: 3.5rem
}

.line-numbers-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  border-right: 1px solid rgba(0, 0, 0, .5);
  padding: 1.25rem 0;
  width: 3.5rem;
  text-align: center;
  line-height: var(--code-line-height);
  font-family: var(--code-font-family);
  font-size: var(--code-font-size);
  color: #888
}

[class*=language-]:before {
  position: absolute;
  top: .6em;
  right: 1em;
  z-index: 2;
  font-size: .8rem;
  color: #888
}

[class~=language-html]:before,
[class~=language-markup]:before {
  content: 'html'
}

[class~=language-markdown]:before,
[class~=language-md]:before {
  content: 'md'
}

[class~=language-css]:before {
  content: 'css'
}

[class~=language-sass]:before {
  content: 'sass'
}

[class~=language-scss]:before {
  content: 'scss'
}

[class~=language-less]:before {
  content: 'less'
}

[class~=language-stylus]:before {
  content: 'styl'
}

[class~=language-javascript]:before,
[class~=language-js]:before {
  content: 'js'
}

[class~=language-ts]:before,
[class~=language-typescript]:before {
  content: 'ts'
}

[class~=language-json]:before {
  content: 'json'
}

[class~=language-rb]:before,
[class~=language-ruby]:before {
  content: 'rb'
}

[class~=language-py]:before,
[class~=language-python]:before {
  content: 'py'
}

[class~=language-bash]:before,
[class~=language-sh]:before {
  content: 'sh'
}

[class~=language-php]:before {
  content: 'php'
}

[class~=language-go]:before {
  content: 'go'
}

[class~=language-rust]:before {
  content: 'rust'
}

[class~=language-java]:before {
  content: 'java'
}

[class~=language-c]:before {
  content: 'c'
}

[class~=language-yaml]:before {
  content: 'yaml'
}

[class~=language-dockerfile]:before {
  content: 'dockerfile'
}

.token.block-comment,
.token.cdata,
.token.comment,
.token.doctype,
.token.prolog {
  color: #999
}

.token.punctuation {
  color: #ccc
}

.token.attr-name,
.token.deleted,
.token.namespace,
.token.tag {
  color: #e2777a
}

.token.function-name {
  color: #6196cc
}

.token.boolean,
.token.function,
.token.number {
  color: #f08d49
}

.token.class-name,
.token.constant,
.token.property,
.token.symbol {
  color: #f8c555
}

.token.atrule,
.token.builtin,
.token.important,
.token.keyword,
.token.selector {
  color: #cc99cd
}

.token.attr-value,
.token.char,
.token.regex,
.token.string,
.token.variable {
  color: #7ec699
}

.token.entity,
.token.operator,
.token.url {
  color: #67cdcc
}

.token.bold,
.token.important {
  font-weight: 700
}

.token.italic {
  font-style: italic
}

.token.entity {
  cursor: help
}

.token.inserted {
  color: green
}

@media (min-width:420px) {
  div[class*=language-] {
    margin: 1rem 0;
    border-radius: 6px
  }
  li>div[class*=language-] {
    margin: 1rem 0 1rem 0;
    border-radius: 6px
  }
}

.custom-block.danger,
.custom-block.tip,
.custom-block.warning {
  margin: 1rem 0;
  border-left: .5rem solid;
  padding: .1rem 1.5rem;
  overflow-x: auto
}

.custom-block.tip {
  background-color: #f3f5f7;
  border-color: var(--c-brand)
}

.custom-block.warning {
  border-color: #e7c000;
  color: #6b5900;
  background-color: rgba(255, 229, 100, .3)
}

.custom-block.warning .custom-block-title {
  color: #b29400
}

.custom-block.warning a {
  color: var(--c-text)
}

.custom-block.danger {
  border-color: #c00;
  color: #4d0000;
  background-color: #ffe6e6
}

.custom-block.danger .custom-block-title {
  color: #900
}

.custom-block.danger a {
  color: var(--c-text)
}

.custom-block.details {
  position: relative;
  display: block;
  border-radius: 2px;
  margin: 1.6em 0;
  padding: 1.6em;
  background-color: #eee
}

.custom-block.details h4 {
  margin-top: 0
}

.custom-block.details figure:last-child,
.custom-block.details p:last-child {
  margin-bottom: 0;
  padding-bottom: 0
}

.custom-block.details summary {
  outline: 0;
  cursor: pointer
}

.custom-block-title {
  margin-bottom: -.4rem;
  font-weight: 600
}

.sidebar-links {
  margin: 0;
  padding: 0;
  list-style: none
}

.sidebar-link-item {
  display: block;
  margin: 0;
  border-left: .25rem solid transparent;
  color: var(--c-text)
}

a.sidebar-link-item:hover {
  text-decoration: none;
  color: var(--c-brand)
}

a.sidebar-link-item.active {
  color: var(--c-brand)
}

.sidebar>.sidebar-links {
  padding: .75rem 0 5rem
}

.sidebar>.sidebar-links>.sidebar-link+.sidebar-link {
  padding-top: .5rem
}

.sidebar>.sidebar-links>.sidebar-link>.sidebar-link-item {
  padding: .35rem 1.5rem .35rem 1.25rem;
  font-size: 1.1rem;
  font-weight: 700
}

.sidebar>.sidebar-links>.sidebar-link>a.sidebar-link-item.active {
  border-left-color: var(--c-brand);
  font-weight: 600
}

.sidebar>.sidebar-links>.sidebar-link>.sidebar-links>.sidebar-link>.sidebar-link-item {
  display: block;
  padding: .35rem 1.5rem .35rem 2rem;
  line-height: 1.4;
  font-size: 1rem;
  font-weight: 400
}

.sidebar>.sidebar-links>.sidebar-link>.sidebar-links>.sidebar-link>a.sidebar-link-item.active {
  border-left-color: var(--c-brand);
  font-weight: 600
}

.sidebar>.sidebar-links>.sidebar-link>.sidebar-links>.sidebar-link>.sidebar-links>.sidebar-link>.sidebar-link-item {
  display: block;
  padding: .3rem 1.5rem .3rem 3rem;
  line-height: 1.4;
  font-size: .9rem;
  font-weight: 400
}

.sidebar>.sidebar-links>.sidebar-link>.sidebar-links>.sidebar-link>.sidebar-links>.sidebar-link>.sidebar-links>.sidebar-link>.sidebar-link-item {
  display: block;
  padding: .3rem 1.5rem .3rem 4rem;
  line-height: 1.4;
  font-size: .9rem;
  font-weight: 400
}

@media (min-width:720px) {
  .sidebar>.sidebar-links {
    padding: 1.5rem 0
  }
  .sidebar>.sidebar-links>.sidebar-link+.sidebar-link {
    padding-top: 1.25rem
  }
}

.debug[data-v-35c33521] {
  box-sizing: border-box;
  position: fixed;
  right: 8px;
  bottom: 8px;
  z-index: 9999;
  border-radius: 4px;
  width: 74px;
  height: 32px;
  color: #eee;
  overflow: hidden;
  cursor: pointer;
  background-color: rgba(0, 0, 0, .85);
  transition: all .15s ease
}

.debug[data-v-35c33521]:hover {
  background-color: rgba(0, 0, 0, .75)
}

.debug.open[data-v-35c33521] {
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  margin-top: 0;
  border-radius: 0;
  padding: 0 0;
  overflow: scroll
}

.debug.open[data-v-35c33521]:hover {
  background-color: rgba(0, 0, 0, .85)
}

.title[data-v-35c33521] {
  margin: 0;
  padding: 6px 16px 6px;
  line-height: 20px;
  font-size: 13px
}

.block[data-v-35c33521] {
  margin: 2px 0 0;
  border-top: 1px solid rgba(255, 255, 255, .16);
  padding: 8px 16px;
  font-family: Hack, monospace;
  font-size: 13px
}

.block+.block[data-v-35c33521] {
  margin-top: 8px
}

@media (min-width:512px) {
  .debug.open[data-v-35c33521] {
    width: 512px
  }
}

.nav-bar-title[data-v-8dbfef3c] {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text)
}

.nav-bar-title[data-v-8dbfef3c]:hover {
  text-decoration: none
}

.logo[data-v-8dbfef3c] {
  margin-right: .75rem;
  height: 1.3rem;
  vertical-align: bottom
}

.icon.outbound {
  position: relative;
  top: -1px;
  display: inline-block;
  vertical-align: middle;
  color: var(--c-text-lighter)
}

.item[data-v-45eb32c6] {
  display: block;
  padding: 0 1.5rem;
  line-height: 36px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
  white-space: nowrap
}

.item.active[data-v-45eb32c6],
.item[data-v-45eb32c6]:hover {
  text-decoration: none;
  color: var(--c-brand)
}

.item.external[data-v-45eb32c6]:hover {
  border-bottom-color: transparent;
  color: var(--c-text)
}

@media (min-width:720px) {
  .item[data-v-45eb32c6] {
    border-bottom: 2px solid transparent;
    padding: 0;
    line-height: 24px;
    font-size: .9rem;
    font-weight: 500
  }
  .item.active[data-v-45eb32c6],
  .item[data-v-45eb32c6]:hover {
    border-bottom-color: var(--c-brand);
    color: var(--c-text)
  }
}

.item[data-v-d552fd76] {
  display: block;
  padding: 0 1.5rem 0 2.5rem;
  line-height: 32px;
  font-size: .9rem;
  font-weight: 500;
  color: var(--c-text);
  white-space: nowrap
}

.item.active[data-v-d552fd76],
.item[data-v-d552fd76]:hover {
  text-decoration: none;
  color: var(--c-brand)
}

.item.external[data-v-d552fd76]:hover {
  border-bottom-color: transparent;
  color: var(--c-text)
}

@media (min-width:720px) {
  .item[data-v-d552fd76] {
    padding: 0 24px 0 12px;
    line-height: 32px;
    font-size: .85rem;
    font-weight: 500;
    color: var(--c-text);
    white-space: nowrap
  }
  .item.active .arrow[data-v-d552fd76] {
    opacity: 1
  }
  .arrow[data-v-d552fd76] {
    display: inline-block;
    margin-right: 8px;
    border-top: 6px solid #ccc;
    border-right: 4px solid transparent;
    border-bottom: 0;
    border-left: 4px solid transparent;
    vertical-align: middle;
    opacity: 0;
    transform: translateY(-2px) rotate(-90deg)
  }
}

.nav-dropdown-link[data-v-6bbf01f6] {
  position: relative;
  height: 36px;
  overflow: hidden;
  cursor: pointer
}

.nav-dropdown-link.open[data-v-6bbf01f6] {
  height: auto
}

.button[data-v-6bbf01f6] {
  display: block;
  border: 0;
  padding: 0 1.5rem;
  width: 100%;
  text-align: left;
  line-height: 36px;
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
  white-space: nowrap;
  background-color: transparent;
  cursor: pointer
}

.button[data-v-6bbf01f6]:focus {
  outline: 0
}

.button-arrow[data-v-6bbf01f6] {
  display: inline-block;
  margin-top: -1px;
  margin-left: 8px;
  border-top: 6px solid #ccc;
  border-right: 4px solid transparent;
  border-bottom: 0;
  border-left: 4px solid transparent;
  vertical-align: middle
}

.button-arrow.right[data-v-6bbf01f6] {
  transform: rotate(-90deg)
}

.dialog[data-v-6bbf01f6] {
  margin: 0;
  padding: 0;
  list-style: none
}

@media (min-width:720px) {
  .nav-dropdown-link[data-v-6bbf01f6] {
    height: auto;
    overflow: visible
  }
  .nav-dropdown-link:hover .dialog[data-v-6bbf01f6] {
    display: block
  }
  .button[data-v-6bbf01f6] {
    border-bottom: 2px solid transparent;
    padding: 0;
    line-height: 24px;
    font-size: .9rem;
    font-weight: 500
  }
  .button-arrow.right[data-v-6bbf01f6] {
    transform: rotate(0)
  }
  .dialog[data-v-6bbf01f6] {
    display: none;
    position: absolute;
    top: 26px;
    right: -8px;
    border-radius: 6px;
    padding: 12px 0;
    min-width: 128px;
    background-color: var(--c-bg);
    box-shadow: var(--shadow-3)
  }
}

.nav-links[data-v-38e3b123] {
  padding: .75rem 0;
  border-bottom: 1px solid var(--c-divider)
}

@media (min-width:720px) {
  .nav-links[data-v-38e3b123] {
    display: flex;
    padding: 6px 0 0;
    align-items: center;
    border-bottom: 0
  }
  .item+.item[data-v-38e3b123] {
    padding-left: 24px
  }
}

.sidebar-button {
  position: absolute;
  top: .6rem;
  left: 1rem;
  display: none;
  padding: .6rem;
  cursor: pointer
}

.sidebar-button .icon {
  display: block;
  width: 1.25rem;
  height: 1.25rem
}

@media screen and (max-width:719px) {
  .sidebar-button {
    display: block
  }
}

.nav-bar[data-v-5df6160f] {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--z-index-navbar);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--c-divider);
  padding: .7rem 1.5rem .7rem 4rem;
  height: var(--header-height);
  background-color: var(--c-bg)
}

.flex-grow[data-v-5df6160f] {
  flex-grow: 1
}

.nav[data-v-5df6160f] {
  display: none
}

@media (min-width:720px) {
  .nav-bar[data-v-5df6160f] {
    padding: .7rem 1.5rem
  }
  .nav[data-v-5df6160f] {
    display: block
  }
}

.sidebar[data-v-58e261f2] {
  position: fixed;
  top: var(--header-height);
  bottom: 0;
  left: 0;
  z-index: var(--z-index-sidebar);
  border-right: 1px solid var(--c-divider);
  width: 16.4rem;
  background-color: var(--c-bg);
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform .25s ease
}

.sidebar.open[data-v-58e261f2] {
  transform: translateX(0)
}

.nav[data-v-58e261f2] {
  display: block
}

@media (min-width:720px) {
  .sidebar[data-v-58e261f2] {
    transform: translateX(0)
  }
  .nav[data-v-58e261f2] {
    display: none
  }
}

@media (min-width:960px) {
  .sidebar[data-v-58e261f2] {
    width: 20rem
  }
}

.link[data-v-3ae295f1] {
  display: inline-block;
  font-size: 1rem;
  font-weight: 500;
  color: var(--c-text-light)
}

.link[data-v-3ae295f1]:hover {
  text-decoration: none;
  color: var(--c-brand)
}

.icon[data-v-3ae295f1] {
  margin-left: 4px
}

.last-updated[data-v-52854a16] {
  display: inline-block;
  margin: 0;
  line-height: 1.4;
  font-size: .9rem;
  color: var(--c-text-light)
}

.prefix[data-v-52854a16] {
  display: inline-block;
  font-weight: 500
}

.datetime[data-v-52854a16] {
  display: inline-block;
  margin-left: 6px;
  font-weight: 400
}

@media (min-width:960px) {
  .last-updated[data-v-52854a16] {
    font-size: 1rem
  }
}

.page-footer[data-v-5a019cc9] {
  padding-top: 1rem;
  padding-bottom: 1rem;
  overflow: auto
}

.updated[data-v-5a019cc9] {
  padding-top: 4px
}

@media (min-width:960px) {
  .page-footer[data-v-5a019cc9] {
    display: flex;
    justify-content: space-between;
    align-items: center
  }
  .updated[data-v-5a019cc9] {
    padding-top: 0
  }
}

.next-and-prev-link[data-v-6683615c] {
  padding-top: 1rem
}

.container[data-v-6683615c] {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--c-divider);
  padding-top: 1rem
}

.next[data-v-6683615c],
.prev[data-v-6683615c] {
  display: flex;
  flex-shrink: 0;
  width: 50%
}

.prev[data-v-6683615c] {
  justify-content: flex-start;
  padding-right: 12px
}

.next[data-v-6683615c] {
  justify-content: flex-end;
  padding-left: 12px
}

.link[data-v-6683615c] {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  font-size: 1rem;
  font-weight: 500
}

.text[data-v-6683615c] {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}

.icon[data-v-6683615c] {
  display: block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  fill: var(--c-text);
  transform: translateY(1px)
}

.icon-prev[data-v-6683615c] {
  margin-right: 8px
}

.icon-next[data-v-6683615c] {
  margin-left: 8px
}

.page[data-v-d36a7fda] {
  padding-top: var(--header-height)
}

.container[data-v-d36a7fda] {
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
  max-width: 48rem
}

.content[data-v-d36a7fda] {
  padding-bottom: 1.5rem
}

@media (min-width:720px) {
  .page[data-v-d36a7fda] {
    margin-left: 16.4rem
  }
}

@media (min-width:960px) {
  .page[data-v-d36a7fda] {
    margin-left: 20rem
  }
}

@media (max-width:420px) {
  .content[data-v-d36a7fda] {
    clear: both
  }
}

#ads-container {
  margin: 0 auto
}

@media (min-width:420px) {
  #ads-container {
    position: relative;
    right: 0;
    float: right;
    margin: -8px -8px 24px 24px;
    width: 146px
  }
}

@media (min-width:1400px) {
  #ads-container {
    position: fixed;
    right: 8px;
    bottom: 8px
  }
}

@media (max-width:420px) {
  #ads-container {
    height: 105px;
    margin: 1.75rem 0
  }
}

*,
::after,
::before {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb
}

* {
  --tw-ring-inset: var(--tw-empty, );
  /*!*/
  /*!*/
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(59, 130, 246, 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000
}

:root {
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4
}

:-moz-focusring {
  outline: 1px dotted ButtonText
}

:-moz-ui-invalid {
  box-shadow: none
}

::moz-focus-inner {
  border-style: none;
  padding: 0
}

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto
}

::-webkit-search-decoration {
  -webkit-appearance: none
}

::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit
}

[type=search] {
  -webkit-appearance: textfield;
  outline-offset: -2px
}

abbr[title] {
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted
}

body {
  margin: 0;
  font-family: inherit;
  line-height: inherit
}

html {
  -webkit-text-size-adjust: 100%;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  line-height: 1.5
}

button,
select {
  text-transform: none
}

[type=button],
[type=reset],
[type=submit],
button {
  -webkit-appearance: button
}

button {
  background-color: transparent;
  background-image: none
}

button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color
}

[role=button],
button {
  cursor: pointer
}

code,
pre {
  font-size: 1em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace
}

hr {
  height: 0;
  color: inherit;
  border-top-width: 1px
}

button,
input,
select {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  padding: 0;
  line-height: inherit;
  color: inherit
}

input::placeholder {
  opacity: 1;
  color: #9ca3af
}

input::webkit-input-placeholder {
  opacity: 1;
  color: #9ca3af
}

input::-moz-placeholder {
  opacity: 1;
  color: #9ca3af
}

input:-ms-input-placeholder {
  opacity: 1;
  color: #9ca3af
}

input::-ms-input-placeholder {
  opacity: 1;
  color: #9ca3af
}

hr,
pre {
  margin: 0
}

[multiple],
[type=date],
[type=datetime-local],
[type=email],
[type=month],
[type=number],
[type=password],
[type=search],
[type=tel],
[type=text],
[type=time],
[type=url],
[type=week],
select,
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px;
  border-radius: 0;
  padding-top: .5rem;
  padding-right: .75rem;
  padding-bottom: .5rem;
  padding-left: .75rem;
  font-size: 1rem;
  line-height: 1.5rem
}

[multiple]:focus,
[type=date]:focus,
[type=datetime-local]:focus,
[type=email]:focus,
[type=month]:focus,
[type=number]:focus,
[type=password]:focus,
[type=search]:focus,
[type=tel]:focus,
[type=text]:focus,
[type=time]:focus,
[type=url]:focus,
[type=week]:focus,
select:focus,
textarea:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty, );
  /*!*/
  /*!*/
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  border-color: #2563eb
}

[type=checkbox],
[type=radio] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  color: #2563eb;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px
}

[type=checkbox]:focus,
[type=radio]:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty, );
  /*!*/
  /*!*/
  --tw-ring-offset-width: 2px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  border-color: #6b7280
}

[type=checkbox]:checked,
[type=radio]:checked {
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat
}

[type=checkbox]:checked:focus,
[type=checkbox]:checked:hover,
[type=radio]:checked:focus,
[type=radio]:checked:hover {
  border-color: transparent;
  background-color: currentColor
}

[type=checkbox]:indeterminate:focus,
[type=checkbox]:indeterminate:hover {
  border-color: transparent;
  background-color: currentColor
}

::-webkit-datetime-edit-fields-wrapper {
  padding: 0
}

::-webkit-date-and-time-value {
  min-height: 1.5em
}

[multiple] {
  background-image: initial;
  background-position: initial;
  background-repeat: unset;
  background-size: initial;
  padding-right: .75rem;
  -webkit-print-color-adjust: unset;
  color-adjust: unset
}

[type=checkbox] {
  border-radius: 0
}

[type=radio] {
  border-radius: 100%
}

[type=checkbox]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")
}

[type=radio]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e")
}

[type=checkbox]:indeterminate {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat
}

[type=file] {
  background: unset;
  border-color: inherit;
  border-width: 0;
  border-radius: 0;
  padding: 0;
  font-size: unset;
  line-height: inherit
}

[type=file]:focus {
  outline: 1px solid ButtonText;
  outline: 1px auto -webkit-focus-ring-color
}

input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #6b7280;
  opacity: 1
}

input::-ms-input-placeholder,
textarea::-ms-input-placeholder {
  color: #6b7280;
  opacity: 1
}

input::placeholder,
textarea::placeholder {
  color: #6b7280;
  opacity: 1
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right .5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  color-adjust: exact
}

.space-x-4>:not([hidden])~:not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1rem * var(--tw-space-x-reverse));
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)))
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity))
}

.bg-gray-600 {
  --tw-bg-opacity: 1;
  background-color: rgba(75, 85, 99, var(--tw-bg-opacity))
}

.bg-gray-300 {
  --tw-bg-opacity: 1;
  background-color: rgba(209, 213, 219, var(--tw-bg-opacity))
}

.bg-primary {
  --tw-bg-opacity: 1;
  background-color: rgba(62, 175, 124, var(--tw-bg-opacity))
}

.hover\:bg-gray-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(243, 244, 246, var(--tw-bg-opacity))
}

.bg-opacity-50 {
  --tw-bg-opacity: 0.5
}

.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgba(209, 213, 219, var(--tw-border-opacity))
}

.focus\:border-primary:focus {
  --tw-border-opacity: 1;
  border-color: rgba(62, 175, 124, var(--tw-border-opacity))
}

.disabled\:border-gray-300:disabled {
  --tw-border-opacity: 1;
  border-color: rgba(209, 213, 219, var(--tw-border-opacity))
}

.rounded {
  border-radius: .25rem
}

.rounded-md {
  border-radius: .375rem
}

.rounded-lg {
  border-radius: .5rem
}

.rounded-full {
  border-radius: 9999px
}

.border {
  border-width: 1px
}

.cursor-not-allowed {
  cursor: not-allowed
}

.cursor-pointer {
  cursor: pointer
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed
}

.not-disabled\:cursor-pointer:not(:disabled) {
  cursor: pointer
}

.block {
  display: block
}

.flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex
}

.grid {
  display: -ms-grid;
  display: grid
}

.hidden {
  display: none
}

.items-center {
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center
}

.justify-between {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between
}

.flex-1 {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 0%;
  -webkit-flex: 1 1 0%;
  flex: 1 1 0%
}

.font-bold {
  font-weight: 700
}

.font-semibold {
  font-weight: 600
}

.font-medium {
  font-weight: 500
}

.h-5 {
  height: 1.25rem
}

.h-screen {
  height: 100vh
}

.h-auto {
  height: auto
}

.h-6 {
  height: 1.5rem
}

.h-4 {
  height: 1rem
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem
}

.text-sm {
  font-size: .875rem;
  line-height: 1.25rem
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem
}

.m-0 {
  margin: 0
}

.m-auto {
  margin: auto
}

.my-8 {
  margin-top: 2rem;
  margin-bottom: 2rem
}

.mr-2 {
  margin-right: .5rem
}

.mb-2 {
  margin-bottom: .5rem
}

.mb-8 {
  margin-bottom: 2rem
}

.mb-1 {
  margin-bottom: .25rem
}

.mb-12 {
  margin-bottom: 3rem
}

.mb-3 {
  margin-bottom: .75rem
}

.ml-2 {
  margin-left: .5rem
}

.ml-4 {
  margin-left: 1rem
}

.max-w-md {
  max-width: 28rem
}

.min-w-0 {
  min-width: 0
}

.disabled\:opacity-50:disabled {
  opacity: .5
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px
}

.p-8 {
  padding: 2rem
}

.p-1 {
  padding: .25rem
}

.py-2 {
  padding-top: .5rem;
  padding-bottom: .5rem
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem
}

.fixed {
  position: fixed
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0
}

.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)
}

.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)
}

.focus\:ring:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  -webkit-box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
}

.ring-offset-1 {
  --tw-ring-offset-width: 1px
}

.focus\:ring-offset-0:focus {
  --tw-ring-offset-width: 0px
}

.focus\:ring-primary:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgba(62, 175, 124, var(--tw-ring-opacity))
}

.focus\:ring-opacity-50:focus {
  --tw-ring-opacity: 0.5
}

.text-center {
  text-align: center
}

.text-gray-300 {
  --tw-text-opacity: 1;
  color: rgba(209, 213, 219, var(--tw-text-opacity))
}

.text-gray-800 {
  --tw-text-opacity: 1;
  color: rgba(31, 41, 55, var(--tw-text-opacity))
}

.disabled\:text-gray-300:disabled {
  --tw-text-opacity: 1;
  color: rgba(209, 213, 219, var(--tw-text-opacity))
}

.not-disabled\:text-primary:not(:disabled) {
  --tw-text-opacity: 1;
  color: rgba(62, 175, 124, var(--tw-text-opacity))
}

.w-5 {
  width: 1.25rem
}

.w-full {
  width: 100%
}

.w-10 {
  width: 2.5rem
}

.w-screen {
  width: 100vw
}

.w-4 {
  width: 1rem
}

.z-50 {
  z-index: 50
}

.gap-x-8 {
  -webkit-column-gap: 2rem;
  -moz-column-gap: 2rem;
  grid-column-gap: 2rem;
  column-gap: 2rem
}

.gap-y-4 {
  -webkit-row-gap: 1rem;
  -moz-row-gap: 1rem;
  grid-row-gap: 1rem;
  row-gap: 1rem
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr))
}

.transform {
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  -webkit-transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  -ms-transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

.translate-x-4 {
  --tw-translate-x: 1rem
}

.transition-all {
  -webkit-transition-property: all;
  -o-transition-property: all;
  transition-property: all;
  -webkit-transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  -o-transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  -webkit-transition-duration: 150ms;
  -o-transition-duration: 150ms;
  transition-duration: 150ms
}

.ease-in-out {
  -webkit-transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  -o-transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-timing-function: cubic-bezier(.4, 0, .2, 1)
}

.duration-300 {
  -webkit-transition-duration: .3s;
  -o-transition-duration: .3s;
  transition-duration: .3s
}

@media (min-width:768px) {
  .md\:relative {
    position: relative
  }
  .md\:gap-x-8 {
    -webkit-column-gap: 2rem;
    -moz-column-gap: 2rem;
    grid-column-gap: 2rem;
    column-gap: 2rem
  }
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr))
  }
}

body {
  font-family: Roboto, sans-serif;
  line-height: 1.5
}

h2 {
  font-weight: 600;
  margin-top: 3rem;
  margin-bottom: 1rem;
  line-height: 1.25;
  font-size: 1.65rem
}

h3 {
  font-weight: 600;
  margin-top: 2rem;
  font-size: 1.35rem
}

.nav-bar-title {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center
}

[type=range][data-v-3aa1880a] {
  -webkit-appearance: none;
  background: 0 0;
  margin: 10px 0;
  width: 100%;
  cursor: pointer
}

[type=range][data-v-3aa1880a]::-moz-focus-outer {
  border: 0
}

[type=range][data-v-3aa1880a]::-webkit-slider-runnable-track {
  height: 6px;
  transition: all .2s ease;
  width: 100%;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .05), 0 0 1px rgba(13, 13, 13, .05);
  background: #d1d5db;
  border: 0 solid #6b7280;
  border-radius: 5px
}

[type=range][data-v-3aa1880a]::-webkit-slider-thumb {
  box-shadow: 2px 2px 4px rgba(0, 0, 0, .2), 0 0 2px rgba(13, 13, 13, .2);
  background: #3eaf7c;
  border: 1px solid #3eaf7c;
  border-radius: 12px;
  box-sizing: border-box;
  height: 20px;
  width: 20px;
  -webkit-appearance: none;
  margin-top: -7px
}

[type=range][data-v-3aa1880a]::-moz-range-track {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .05), 0 0 1px rgba(13, 13, 13, .05);
  height: 6px;
  transition: all .2s ease;
  width: 100%;
  background: #d1d5db;
  border: 0 solid #6b7280;
  border-radius: 5px;
  height: 3px
}

[type=range][data-v-3aa1880a]::-moz-range-thumb {
  box-shadow: 2px 2px 4px rgba(0, 0, 0, .2), 0 0 2px rgba(13, 13, 13, .2);
  background: #3eaf7c;
  border: 1px solid #3eaf7c;
  border-radius: 12px;
  box-sizing: border-box;
  height: 20px;
  width: 20px
}

[type=range][data-v-3aa1880a]::-ms-track {
  height: 6px;
  transition: all .2s ease;
  width: 100%;
  background: 0 0;
  border-color: transparent;
  border-width: 10px 0;
  color: transparent
}

[type=range][data-v-3aa1880a]::-ms-fill-lower {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .05), 0 0 1px rgba(13, 13, 13, .05);
  background: #c3c8d0;
  border: 0 solid #6b7280;
  border-radius: 10px
}

[type=range][data-v-3aa1880a]::-ms-fill-upper {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .05), 0 0 1px rgba(13, 13, 13, .05);
  background: #d1d5db;
  border: 0 solid #6b7280;
  border-radius: 10px
}

[type=range][data-v-3aa1880a]::-ms-thumb {
  box-shadow: 2px 2px 4px rgba(0, 0, 0, .2), 0 0 2px rgba(13, 13, 13, .2);
  background: #3eaf7c;
  border: 1px solid #3eaf7c;
  border-radius: 12px;
  box-sizing: border-box;
  height: 20px;
  width: 20px;
  margin-top: 1.5px
}

[type=range][data-v-3aa1880a]:disabled {
  opacity: 50%;
  cursor: not-allowed
}

.home-hero[data-v-1d68b262] {
  margin: 2.5rem 0 2.75rem;
  padding: 0 1.5rem;
  text-align: center
}

.figure[data-v-1d68b262] {
  padding: 0 1.5rem
}

.image[data-v-1d68b262] {
  display: block;
  margin: 0 auto;
  width: auto;
  max-width: 100%;
  max-height: 280px
}

.title[data-v-1d68b262] {
  margin-top: 1.5rem;
  font-size: 2rem
}

.description[data-v-1d68b262] {
  margin: 0;
  margin-top: .25rem;
  line-height: 1.3;
  font-size: 1.2rem;
  color: var(--c-text-light)
}

.action[data-v-1d68b262] {
  margin-top: 1.5rem;
  display: inline-block
}

.action.alt[data-v-1d68b262] {
  margin-left: 1.5rem
}

.action[data-v-1d68b262] .item {
  display: inline-block;
  border-radius: 6px;
  padding: 0 20px;
  line-height: 44px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--c-bg);
  background-color: var(--c-brand);
  border: 2px solid var(--c-brand);
  transition: background-color .1s ease
}

.action.alt[data-v-1d68b262] .item {
  background-color: var(--c-bg);
  color: var(--c-brand)
}

.action[data-v-1d68b262] .item:hover {
  text-decoration: none;
  color: var(--c-bg);
  background-color: var(--c-brand-light)
}

@media (min-width:420px) {
  .home-hero[data-v-1d68b262] {
    margin: 3.5rem 0
  }
  .title[data-v-1d68b262] {
    font-size: 3rem
  }
  .description[data-v-1d68b262] {
    line-height: 1.2;
    font-size: 1.6rem
  }
  .action[data-v-1d68b262] {
    margin-top: 2rem;
    display: inline-block
  }
  .action[data-v-1d68b262] .item {
    padding: 0 24px;
    line-height: 52px;
    font-size: 1.2rem;
    font-weight: 500
  }
}

@media (min-width:720px) {
  .home-hero[data-v-1d68b262] {
    margin: 4rem 0 4.25rem
  }
  .title[data-v-1d68b262] {
    margin-top: 2rem
  }
}

.home-features[data-v-b6f3c2e6] {
  margin: 0 auto;
  padding: 2.5rem 0 2.75rem;
  max-width: 960px
}

.home-hero+.home-features[data-v-b6f3c2e6] {
  padding-top: 0
}

.wrapper[data-v-b6f3c2e6] {
  padding: 0 1.5rem
}

.home-hero+.home-features .wrapper[data-v-b6f3c2e6] {
  border-top: 1px solid var(--c-divider);
  padding-top: 2.5rem
}

.container[data-v-b6f3c2e6] {
  margin: 0 auto;
  max-width: 392px
}

.features[data-v-b6f3c2e6] {
  display: flex;
  flex-wrap: wrap;
  margin: -20px -24px
}

.feature[data-v-b6f3c2e6] {
  flex-shrink: 0;
  padding: 20px 24px;
  width: 100%
}

.title[data-v-b6f3c2e6] {
  margin: 0;
  border-bottom: 0;
  line-height: 1.4;
  font-size: 1.25rem;
  font-weight: 500
}

.details[data-v-b6f3c2e6] {
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
  color: var(--c-text-light)
}

.title+.details[data-v-b6f3c2e6] {
  padding-top: .25rem
}

@media (min-width:420px) {
  .home-features[data-v-b6f3c2e6] {
    padding: 3.25rem 0 3.5rem
  }
  .home-hero+.home-features[data-v-b6f3c2e6] {
    padding-top: 0
  }
  .home-hero+.home-features .wrapper[data-v-b6f3c2e6] {
    padding-top: 3.25rem
  }
  .title[data-v-b6f3c2e6] {
    font-size: 1.4rem
  }
}

@media (min-width:720px) {
  .home-features[data-v-b6f3c2e6] {
    padding-right: 1.5rem;
    padding-left: 1.5rem
  }
  .wrapper[data-v-b6f3c2e6] {
    padding-right: 0;
    padding-left: 0
  }
  .container[data-v-b6f3c2e6] {
    max-width: 960px
  }
  .feature[data-v-b6f3c2e6] {
    width: calc(100% / 3)
  }
}

.footer[data-v-93d3e3da] {
  margin: 0 auto;
  max-width: 960px
}

.container[data-v-93d3e3da] {
  padding: 2rem 1.5rem 2.25rem
}

.home-content+.footer .container[data-v-93d3e3da],
.home-features+.footer .container[data-v-93d3e3da],
.home-hero+.footer .container[data-v-93d3e3da] {
  border-top: 1px solid var(--c-divider)
}

.text[data-v-93d3e3da] {
  margin: 0;
  text-align: center;
  line-height: 1.4;
  font-size: .9rem;
  color: var(--c-text-light)
}

@media (min-width:420px) {
  .container[data-v-93d3e3da] {
    padding: 3rem 1.5rem 3.25rem
  }
}

@media (min-width:720px) {
  .footer[data-v-93d3e3da] {
    padding: 0 1.5rem
  }
}

.home[data-v-6e1bdf43] {
  padding-top: var(--header-height)
}

.home-content[data-v-6e1bdf43] {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem
}

@media (max-width:720px) {
  .home-content[data-v-6e1bdf43] {
    max-width: 392px;
    padding: 0
  }
}
</style>