import PropTypes from 'prop-types';

export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ background: '#eeeeee' }}>
      <Component {...pageProps} />
    </div>
  );
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any
};
