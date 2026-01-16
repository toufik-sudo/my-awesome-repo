import React, { useCallback, useEffect } from 'react';

import DashboardBlock from 'components/organisms/wall/dashboard/DashboardBlock';
import { AMOUNT_OF_DECLARATIONS, DASHBOARD_FIELDS, TOTAL_PROGRAM_TOKENS } from 'constants/wall/dashboard';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Dashboard.module.scss';

import AIRAGApi from 'api/IA API/AIRagApi';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import useProgramDetails from 'hooks/programs/useProgramDetails';

/**
 * organism component used to render list of dashboard data
 * @param kpiData
 * @param selectKpi
 * @param selectedKpi
 * @param isAdmin
 * @constructor
 */
const DashboardList = ({ kpiData, selectKpi, selectedKpi, isAdmin }) => {
  const { dashboardKpis } = componentStyle;

  const {
    selectedProgramId,
    selectedProgramName
  } = useWallSelection();

  const [programTokens, setProgramTokens] = React.useState({ [TOTAL_PROGRAM_TOKENS]: 0 });

  const programDetail = useProgramDetails(selectedProgramId);

  const getTokensCountFile = async () => {
    if (programDetail?.programDetails?.iaCompany?.companyName && isAdmin) {
      // selectKpi(3, TOTAL_PROGRAM_TOKENS);
      try {
        const response = await AIRAGApi.getTokensCountXlsxFile();
        // Créer un lien pour le téléchargement
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tokens_count.xlsx'); // Nom du fichier à télécharger
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Erreur lors du téléchargement du fichier :', error);
      }
    }
  }

  const getProgramTokensCount = async () => {
    if (programDetail?.programDetails?.iaCompany?.companyName && isAdmin && isAdmin) {
      try {
        let companyName = programDetail?.programDetails?.iaCompany?.companyName;
        companyName = companyName?.trim().replaceAll(' ', '_');
        const programName = selectedProgramName?.trim().replaceAll(' ', '_') + '_' + selectedProgramId;
        const response = await AIRAGApi.getTokensCount(companyName || "", programName, false, false, true, false);

        setProgramTokens({ [TOTAL_PROGRAM_TOKENS]: response });
      } catch (error) {
        console.error('Erreur lors du téléchargement du fichier :', error);
      }
    }
  };

  useEffect(() => {
    if (selectedProgramId && isAdmin && programDetail?.programDetails?.iaCompany) {
      getProgramTokensCount();
      console.log("Program detail IA company:", programDetail?.programDetails?.iaCompany);
    }
    return () => { setProgramTokens({ [TOTAL_PROGRAM_TOKENS]: 0 }) };
  }, [selectedProgramId, programDetail?.programDetails?.iaCompany?.companyName]);


  return (
    <div className={dashboardKpis}>
      {DASHBOARD_FIELDS.map((kpi, index) => {
        if ((kpi === AMOUNT_OF_DECLARATIONS || kpi == TOTAL_PROGRAM_TOKENS) && !isAdmin) {
          return null;
        }
        if (kpi == TOTAL_PROGRAM_TOKENS) {
          return (
            <DashboardBlock
              key={index}
              {...{
                kpi,
                selectKpi: () => { selectKpi(index, kpi); getTokensCountFile() },
                selectedKpi,
                kpiData: programTokens,
                isAdmin: true
              }}
            />
          )
        }

        return (
          <DashboardBlock
            key={index}
            {...{
              kpi,
              selectKpi: () => selectKpi(index, kpi),
              selectedKpi,
              kpiData,
              isAdmin
            }}
          />
        );
      })}
    </div>
  );
};

export default DashboardList;
