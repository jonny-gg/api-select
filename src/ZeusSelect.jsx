import React from 'react'
import { Select, Spin, Checkbox } from 'antd'
import Fetch from 'igroot-fetch'
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

const { Option } = Select
class ZeusSelect extends React.Component {
  constructor(props) {
    super(props);

    this.lastFetchId = 0;
    this.handleSearch = debounce(this.handleSearch, 800);

    this.state = {
      data: [],
      fetching: false,
      value: ''
    }
  }
  
  componentWillReceiveProps(nextProps, nextContext) {
    const { value } = nextProps
    this.setState({ value })
  }

  handleSearch = value => {
    if (!localStorage.getItem('jwtToken'))
      return console.error("no token, do nothing!")
    const { type, tag = "name", api } = this.props
    this.lastFetchId += 1
    const fetchId = this.lastFetchId
    this.setState({ data: [], fetching: true })
    const param = {
      name: type,
      tag,
      keyword: value,
      limit: 100
    }
    Fetch(`${api}/graphql`, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken') } }).query(`
      query($name: String!,$tag: String,$keyword: String, $limit: Int) {
        configs {
          searchSingle(name: $name, tag: $tag, keyword: $keyword, limit: $limit) {
            id
            name
            values
          }
        }
      }
    `, param).then(res => {
      if (fetchId !== this.lastFetchId) return
      const { data: { configs: { searchSingle } } } = res
      this.setState({ data: searchSingle, fetching: false })
    }).catch(e => this.setState({ fetching: false }))
  }

  handleChange = value => {
    const { onChange } = this.props
    onChange && onChange(value)
    this.setState({ value })
  }

  render() {
    const { value, fetching, data } = this.state
    const { mode, keyword, placeholder, width } = this.props
    return (
      <Select
        mode={mode}
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        optionFilterProp="children"
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        style={{ width }}
        value={value || undefined}
      >
        {data.map(d => <Option title={d.name} key={keyword === 'id' ? d.id : d.name}>{d.name}</Option>)}
      </Select>
    )
  }
}

/**
 * 组件对外抛出的属性
 */
ZeusSelect.propTypes = {
  mode: PropTypes.string,
  keyword: PropTypes.oneOf(['id', 'name']),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  tag: PropTypes.oneOf(['id', 'name']).isRequired,
  api: PropTypes.string,
  box: PropTypes.oneOf(['checkbox', 'radio', 'select']),
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
}

ZeusSelect.defaultProps = {
  mode:"multiple",
  tag: "name",
  keyword: "name",
  type: "domain",
  api: "https://api.xxx.com",
  width: "100%",
  box: 'select'
}

export default ZeusSelect