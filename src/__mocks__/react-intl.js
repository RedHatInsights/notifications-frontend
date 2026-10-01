// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactIntl = require('react-intl');

// Substitutes simple `{name}` placeholders so tests see the same string the real
// IntlProvider renders. Only plain arguments are supported, not ICU plural/select.
const format = (defaultMessage = '', values = {}) =>
  defaultMessage.replace(/{(\w+)}/g, (match, key) => (key in values ? String(values[key]) : match));

// eslint-disable-next-line react/prop-types
const FormattedMessage = ({ defaultMessage = '', values }) => format(defaultMessage, values);
const useIntl = () => ({
  formatMessage: (props, values) => format(props?.defaultMessage ?? '', values),
});

module.exports = {
  __esModule: true,
  ...ReactIntl,
  FormattedMessage,
  useIntl,
};
