import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Seo from '../components/common/Seo';
import Spinner from '../components/common/Spinner';
import Petition from '../components/ui/petition/Petition';
import Tabs from '../components/tabs/Tabs';
import { Wrapper } from '../components/ui/petition/styles';
import NotFound from './notFound/NotFound';
import config from '../utils/config';

const { apiBaseUrl } = config;

const Petitions = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [activeTab, setActiveTab] = useState();
  const [tabData, setTabData] = useState([]);

  useEffect(() => {
    const fetchPetitions = async () => {
      const API_URL = `${apiBaseUrl}/petitions`;

      try {
        const res = await axios.get(API_URL);
        setPetitions(res.data.data);
      } catch (err) {
        setError('Error occured');
        // set error and show error page
      } finally {
        setLoading(false);
      }
    };
    const fetchPetitionType = async () => {
      const API_URL = `${apiBaseUrl}/petition-types`;
      try {
        const res = await axios.get(API_URL);
        // const typeArr = res.data.data.map((data) => data.type);
        setTabData(res.data.data);
      } catch (err) {
        setError('Error occured');
      }
    };
    fetchPetitions();
    fetchPetitionType();
  }, []);

  return (
    <>
      {error && (
        <NotFound
          message="Oops!!! Something went wrong"
          longMessage="Unable to load petitions"
        />
      )}
      {loading ? (
        <Spinner height="95vh" />
      ) : (
        <>
          <Seo
            title="Petitions"
            description="Petitions are another way to show the level of public support for the Black Lives Matter movement"
            image="https://say-their-names.fra1.cdn.digitaloceanspaces.com/petition.png"
          />
          <Wrapper>
            {petitions.length === 0 && !loading ? (
              <h2 className="not-found">NO PETITIONS FOUND</h2>
            ) : (
              <h2>PETITIONS</h2>
            )}
            <p>
              Petitions are another way to show the level of public support for
              the Black Lives Matter movement.
            </p>
            <p>
              SAY THEIR NAMES online and demonstrate to those in power that
              the cause is important to you and you demand justice and change.
            </p>
            {petitions.length > 0 && !loading && (
              <Tabs
                locations={tabData.map((type) => type.type)}
                setState={setActiveTab}
                currentTab={activeTab}
              />
            )}
            {petitions
              .filter((petition) => (activeTab !== undefined
                ? petition.type.type === tabData[activeTab].type
                : petition))
              .map((petition) => (
                <Petition
                  key={petition.id}
                  id={petition.identifier}
                  title={petition.title}
                  description={petition.description}
                  link={petition.link}
                  img={petition.banner_img_url}
                  type={petition.type?.type}
                  path="sign"
                />
              ))}
          </Wrapper>
        </>
      )}
    </>
  );
};

export default Petitions;
