import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';
import Container from '../../components/Container';

import { Loading, Owner, IssueList, IssueFilter, PageAction } from './styles';

export default class Repository extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    repository: {},
    issues: [],
    loading: true,
    filters: [
      { state: 'all', label: 'Todas', active: true, page: 1 },
      { state: 'open', label: 'Abertas', active: false, page: 1 },
      { state: 'closed', label: 'Fechadas', active: false, page: 1 },
    ],
    filterIndex: 0,
  };

  async componentDidMount() {
    const { match } = this.props;

    const { filters } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filters.find(filtered => filtered.active).state,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  loadIssues = async () => {
    const { match } = this.props;

    const { filters, filterIndex } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filters[filterIndex].state,
        per_page: 5,
        page: filters[filterIndex].page,
      },
    });

    this.setState({
      issues: response.data,
    });
  };

  handleFilterClick = async filterIndex => {
    await this.setState({ filterIndex });
    this.loadIssues();
  };

  handlePage = async action => {
    const { filters, filterIndex } = this.state;
    if (action === 'back') {
      filters[filterIndex].page -= 1;
    } else {
      filters[filterIndex].page += 1;
    }
    await this.setState({
      filters,
    });
    this.loadIssues();
  };

  render() {
    const { repository, issues, loading, filters, filterIndex } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Link to="/" text-decoration="none">
          <FaArrowLeft color="#333" size={15} />
        </Link>
        <Owner>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          <IssueFilter active={filterIndex}>
            {filters.map((filterType, index) => (
              <button
                type="button"
                key={filterType.label}
                onClick={() => this.handleFilterClick(index)}
              >
                {filterType.label}
              </button>
            ))}
          </IssueFilter>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <PageAction>
          <button
            type="button"
            disabled={filters[filterIndex].page < 2}
            onClick={() => this.handlePage('back')}
          >
            Anterior
          </button>
          <span>Página {filters[filterIndex].page}</span>
          <button type="button" onClick={() => this.handlePage('next')}>
            Próximo
          </button>
        </PageAction>
      </Container>
    );
  }
}
