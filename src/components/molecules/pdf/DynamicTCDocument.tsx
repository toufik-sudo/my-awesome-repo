import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { useCubeDetailsForPdfCreation } from 'hooks/pdf/useCubeDetailsForPdfCreation';
import { useProgramDetailsForPdfCreation } from 'hooks/pdf/useProgramDetailsForPdfCreation';
/**
 * Template for program dynamic pdf creation
 *
 * @param launchData
 * @param userData
 * @param programType
 * @constructor
 */
const DynamicTCDocument = ({ launchData, userData, programType }) => {
  const {
    mechanisms,
    correlatedGoals,
    translationsGoals,
    cube,
    declarationManualValidation,
    resultsManualValidation,
    pointsAllocationTranslation,
    pointsSpendingTranslation
  } = useCubeDetailsForPdfCreation(launchData);

  const {
    dateNow,
    programName,
    companyName,
    programStartingDate,
    programEndingDate,
    programBudget,
    stateAndCountry
  } = useProgramDetailsForPdfCreation(launchData, userData);
  const programTypeTitle = programType.charAt(0).toUpperCase() + programType.slice(1);
  const goalsJoin = correlatedGoals ? ' and ' : ' or ';

  const styles = StyleSheet.create({
    page: {
      padding: 30
    },
    heading: {
      textAlign: 'center',
      fontSize: 10,
      marginBottom: 20,
      paddingLeft: 15,
      paddingRight: 15,
      fontFamily: 'Helvetica-Bold'
    },
    subtitle: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 2
    },
    text: {
      fontSize: 10,
      lineHeight: 1.4,
      fontFamily: 'Helvetica',
      textAlign: 'justify',
      marginBottom: 10
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/*TC title*/}
        <View>
          <Text style={styles.heading}>{programTypeTitle.toUpperCase()} CONVENTION DE PROGRAMME</Text>
          {/*TC subtitle text*/}
          <View style={{ marginBottom: 20 }}>
            <View style={styles.text}>
              <Text>
                Créée le {dateNow} pour {programName || ''}
              </Text>
              <Text>
                Cette Convention de Programme {programTypeTitle} [ci-après dénommée la « Convention »] est conclue ce{' '}
                {dateNow} entre {companyName || ''}, ci-après dénommée « l’Entreprise », et tout participant inscrit à ce
                Programme, ci-après dénommé « le Bénéficiaire ».
              </Text>
            </View>
          </View>
          {/*TC subtitle*/}
          <View style={styles.subtitle}>
            <Text>Conditions de la Convention</Text>
          </View>
          {/*TC paragraph 1 title*/}
          <View style={styles.subtitle}>
            <Text>1. Obligations du Bénéficiaire</Text>
          </View>
          {/*TC paragraph 1 text -> program's cube details*/}
          <View style={styles.text}>
            <Text>Ceci est un programme {programType}.</Text>
            <Text>Le mécanisme est basé sur : {(mechanisms && mechanisms.join(goalsJoin)) || ''}</Text>
            {(correlatedGoals && <Text>Pour obtenir des points, vous devez atteindre tous les objectifs suivants :</Text>) || (
              <Text>Pour obtenir des points, vous devez atteindre l’un des objectifs suivants :</Text>
            )}
            <Text>{(translationsGoals && translationsGoals.join(`\n${goalsJoin}\n`)) || ''}</Text>
            {cube && cube.rewardPeopleManagerAccepted && (
              <Text>
                Les responsables de programme recevront {cube.rewardPeopleManagers || ''}% des points gagnés par les membres de votre équipe.
              </Text>
            )}
            {(declarationManualValidation || resultsManualValidation) && (
              <Text>Les résultats (vos déclarations) sont validés manuellement par un administrateur.</Text>
            )}
            <Text>Les points sont attribués {pointsAllocationTranslation || ''}</Text>
            <Text>Vous pouvez les convertir {pointsSpendingTranslation || ''}</Text>
          </View>
          {/*TC paragraph 2 title*/}
          <View style={styles.subtitle}>
            <Text>2. Obligations de l’Entreprise</Text>
          </View>
          {/*TC paragraph 2 text*/}
          <View style={styles.text}>
            <Text>L’Entreprise doit payer les points avant qu’ils ne puissent être convertis par un Bénéficiaire.</Text>
            <Text>
              L’Entreprise ne peut interrompre ni annuler le Programme, ni avant la date officielle de fin du Programme, ni
              avant que le Programme n’atteigne le budget maximum de conversion des points.
            </Text>
          </View>
        </View>
        {/*TC paragraph 4 text*/}
        <View>
          {/*TC paragraph 3 title*/}
          <View style={styles.subtitle}>
            <Text>3. Marques et Supports de l’Entreprise</Text>
          </View>
          {/*TC paragraph 3 text*/}
          <View style={styles.text}>
            <Text>
              Sous réserve des termes et conditions de la présente Convention, l’Entreprise accorde au Bénéficiaire le droit
              d’utiliser les noms commerciaux, logos, marques et descriptions de l’Entreprise tels que fournis dans les
              supports marketing de l’Entreprise. Ces éléments peuvent être utilisés dans tout support publicitaire, produit
              promotionnel ou matériel marketing distribué uniquement en lien avec {programName || ''}. Le Bénéficiaire
              s’engage à utiliser ces supports conformément aux directives d’utilisation des marques de l’Entreprise.
            </Text>
          </View>
          {/*TC paragraph 4 title*/}
          <View style={styles.subtitle}>
            <Text>4. Indemnisation</Text>
          </View>
          <View style={styles.text}>
            <Text>
              4.1 L’Entreprise indemnisera, défendra et tiendra le Bénéficiaire à couvert contre toute réclamation liée
              directement ou indirectement aux contenus publiés sur le site web de l’Entreprise, à l’utilisation des supports
              de l’Entreprise ou à l’utilisation des logos et marques de l’Entreprise.
            </Text>
          </View>
          <View style={styles.text}>
            <Text>
              4.2 Le Bénéficiaire ne sera pas responsable des dommages ou pertes de biens appartenant à l’Entreprise, à ses
              employés, contractants ou agents, ni des blessures subies par ses employés, contractants, agents, directeurs
              ou invités, sauf dans la mesure où ces réclamations peuvent être exclusivement et directement attribuées à une
              faute intentionnelle ou à une négligence grave du Bénéficiaire, de ses employés, directeurs ou dirigeants.
            </Text>
            <Text>
              4.3 L’Entreprise informera le Bénéficiaire sans délai par écrit de toute action ou réclamation entrant dans le
              champ de ces indemnisations.
            </Text>
          </View>
          {/*TC paragraph 5 title*/}
          <View style={styles.subtitle}>
            <Text>5. Limitation de Responsabilité</Text>
          </View>
          {/*TC paragraph 5 text*/}
          <View style={styles.text}>
            <Text>
              En aucun cas, l’une des parties ne pourra être tenue responsable envers l’autre de tout dommage indirect,
              accessoire, consécutif ou punitif, que cette responsabilité découle d’une violation de contrat, d’une violation
              de garantie, d’un délit, d’une responsabilité stricte ou autre.
            </Text>
          </View>
          {/*TC paragraph 6 title*/}
          <View style={styles.subtitle}>
            <Text>6. Durée et Résiliation</Text>
          </View>
        </View>

        {/*TC paragraph 7 text*/}
        <View>
          {/*TC paragraph 6 text*/}
          <View style={styles.text}>
            <Text>
              6.1 La présente Convention sera valable pour la période du {programStartingDate || ''}
              {programEndingDate ? ` au ${programEndingDate}` : ''} ou jusqu’à ce que le montant
            </Text>
            <Text>consacré à la conversion des points (« Budget Maximum ») atteigne {programBudget || ''}</Text>
            <Text>
              6.2 Le Bénéficiaire peut résilier la présente Convention à tout moment et pour toute raison. Dans le cas où le
              Bénéficiaire résilie la Convention pour une raison autre qu’une violation de la Convention par l’Entreprise, le
              Bénéficiaire remboursera les frais perçus de l’Entreprise et restituera tout matériel, équipement, matériel
              informatique ou logiciel prêté par l’Entreprise pour l’événement, aux frais de l’Entreprise.
            </Text>
            <Text>
              6.3 L’Entreprise peut résilier la présente Convention en cas de violation par le Bénéficiaire, après avoir
              donné au Bénéficiaire un préavis écrit d’au moins dix (10) jours précisant la nature de la violation et
              accordant au Bénéficiaire un délai d’au moins dix (10) jours pour y remédier. Si la violation survient moins
              de dix (10) jours avant l’événement, l’Entreprise peut résilier la Convention si la violation n’est pas
              corrigée avant le premier jour de l’événement.
            </Text>
          </View>
          {/*TC paragraph 7 title*/}
          <View style={styles.subtitle}>
            <Text>7. Différend</Text>
          </View>
          <View style={styles.text}>
            <Text>
              En cas de différend à quelque moment que ce soit, les parties soumettront la question à un arbitre indépendant
              désigné d’un commun accord.
            </Text>
          </View>
          {/*TC paragraph 8 title*/}
          <View style={styles.subtitle}>
            <Text>8. Divers</Text>
          </View>
          {/*TC paragraph 8 text*/}
          <View style={styles.text}>
            <Text>
              8.1 La présente Convention remplace toute forme d’entente orale ou écrite antérieure entre l’Entreprise et le
              Bénéficiaire. Elle ne peut être modifiée que par avenant écrit signé par les deux parties.
            </Text>
            <Text>
              8.2 La présente Convention sera régie et exécutée conformément aux lois de {stateAndCountry || ''} applicables
              aux conventions conclues et exécutées exclusivement dans cet État.
            </Text>
            <Text style={{ marginBottom: 10 }}>
              8.3 Les termes et conditions de la présente Convention ne devront pas être divulgués à un tiers sans l’accord
              écrit préalable des deux parties.
            </Text>
          </View>
          {/*TC Ending date*/}
          <View style={styles.text}>
            <Text>{dateNow}</Text>
          </View>
        </View>
      </Page>
    </Document>

  );
};

export { DynamicTCDocument };
