import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import { DataObject } from '../Types/resume.types';
import dataURItoBlob from '../Utils/dataURItoBlob';
import PersonalInfo from '../Utils/PersonalInfo';
import ExperienceInfo from '../Utils/ExperienceInfo';
import EducationInfo from '../Utils/EducationInfo';
import { BackLogoResume, LogoInfo } from '../Assets/Images';
import { Link } from 'react-router-dom';

const ResumePage = () => {
  const [data, setData] = useState<DataObject>();

  let storedPersonalData = JSON.parse(localStorage.getItem('dataPersonal'));
  const storedExpData = JSON.parse(localStorage.getItem('dataExp'));
  const storedEducationData = JSON.parse(localStorage.getItem('dataEducation'));

  let fullData = useMemo(() => {
    return { ...storedPersonalData, experiences: storedExpData, educations: storedEducationData };
  }, [storedEducationData, storedExpData, storedPersonalData]) as DataObject;

  storedPersonalData = { ...storedPersonalData, image: dataURItoBlob(storedPersonalData.image) };

  fullData = { ...storedPersonalData, experiences: storedExpData, educations: storedEducationData };

  const getData = () => {
    axios
      .post('https://resume.redberryinternship.ge/api/cvs', fullData, {
        headers: {
          'Content-type': 'multipart/form-data',
          Accept: 'application/json',
        },
      })
      .then((res) => setData(res.data));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col w-[100%] items-center justify-center">
      <Link to={'/'} className="absolute left-10 top-8 translate-y-1">
        <img src={BackLogoResume} alt="Logo" />
      </Link>
      {data !== undefined && (
        <div className="flex flex-col w-[822px] h-[900px] items-center bg-[#F9F9F9] box-border border-[0.8px] border-[#000000] relative mt-10">
          <PersonalInfo
            name={data.name}
            surname={data.surname}
            email={data.email}
            about={data.about_me !== null ? data.about_me : ''}
            mobile={data.phone_number}
            image={`https://resume.redberryinternship.ge/${data.image}`}
          />
          <div className="w-[79%] h-[1px] bg-[#C1C1C1] mt-6" />
          <div className="text-[#F93B1D] w-[80%] mt-4 font-bold text-lg">გამოცდილება</div>
          {data.experiences.map((_: any, i: number) => {
            return (
              data.experiences[i] && (
                <ExperienceInfo
                  key={i}
                  position={data.experiences[i].position}
                  employer={data.experiences[i].employer}
                  start_date={data.experiences[i].start_date}
                  due_date={data.experiences[i].due_date}
                  description={data.experiences[i].description}
                />
              )
            );
          })}
          <div className="w-[79%] h-[1px] bg-[#C1C1C1] mt-6" />
          <div className="text-[#F93B1D] w-[80%] mt-4 font-bold text-lg">განათლება</div>
          {data.educations.map((_: any, i: number) => {
            return (
              data.educations[i] && (
                <EducationInfo
                  key={i}
                  institute={data.educations[i].institute}
                  degree_id={data.educations[i].degree_id}
                  due_date={data.educations[i].due_date}
                  description={data.educations[i].description}
                />
              )
            );
          })}
          <img className="absolute top-[814px] left-[70px]" src={LogoInfo} alt="logo" />
        </div>
      )}
    </div>
  );
};

export default ResumePage;
