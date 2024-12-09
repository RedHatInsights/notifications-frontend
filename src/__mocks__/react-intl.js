// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactIntl = require('react-intl');

// eslint-disable-next-line react/prop-types
const FormattedMessage = ({ defaultMessage = '' }) => defaultMessage;
const useIntl = () => ({
  formatMessage: (props) => props?.defaultMessage ?? '',
});

module.exports = {
  __esModule: true,
  ...ReactIntl,
  FormattedMessage,
  useIntl,
};
