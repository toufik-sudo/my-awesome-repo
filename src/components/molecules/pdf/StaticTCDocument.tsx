import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { FR_VALUE } from '../../../constants/i18n';

const StaticTCDocument = ({ language }) => {
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
    paragraph: {
      marginBottom: 10
    },
    text: {
      fontSize: 10,
      lineHeight: 1.4,
      fontFamily: 'Helvetica',
      textAlign: 'justify'
    }
  });

  const frContent = (
    <View>
      <Text style={styles.heading}>CONTRAT D’ABONNEMENT AU SERVICE RewardzAi EDITE PAR RewardzAi SAS</Text>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>1. DÉFINITIONS ET INTERPRÉTATION</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>1.1 Définition</Text>
        <Text style={styles.paragraph}>
          Les mots et expressions du présent accord (l’« Accord ») ont le sens suivant :
        </Text>
        <Text style={styles.paragraph}>
          Administrateur : les employés, le personnel, les co-contractants du client et toute autre personne travaillant
          avec le client ou en son nom pour accéder aux services fournis qui, dans chaque cas, la personne concernée
          dans l’accès au Service le fait exclusivement pour le compte du Client et avec l’autorisation expresse du
          Client ;
        </Text>
        <Text style={styles.paragraph}>
          Client : Le Client est la société qui souscrit au Service en vertu du présent Contrat et s’étend à toute
          filiale déclarée ;
        </Text>
        <Text style={styles.paragraph}>
          Compte de Cantonnement : Compte tiers de détentions de fonds par le Client et les Utilisateurs autorisés afin
          de gérer tout transfert de valeur entre eux par l’intermédiaire de la Plateforme ;
        </Text>
        <Text style={styles.paragraph}>
          Date d’entrée en vigueur : la date d’abonnement et de réception du paiement par carte de crédit de transfert
          bancaire entraînant le transfert à l’administrateur de l’ouverture de session et du mot de passe donnant
          effectivement accès au logiciel. La Date d’Entrée en Vigueur est confirmée au Client une fois l’accès à la
          Plateforme accordé ;
        </Text>
        <Text style={styles.paragraph}>
          Données du Client : toutes les données, informations et entrées matérielles ou téléchargées sur un Logiciel ou
          transmises par le Service par le Client et/ou tout Utilisateur Autorisé ;
        </Text>
        <Text style={styles.paragraph}>
          Droits de propriété intellectuelle : brevets, modèles d’utilité, droits d’invention, droits d’auteur et droits
          voisins, marques de commerce et de service, noms commerciaux et noms de domaine, droits de reproduction, bonne
          volonté et droit d’intenter des poursuites pour transmission ou concurrence déloyale, les droits de
          conception, les droits relatifs aux logiciels, les droits relatifs aux bases de données, les droits de
          préserver la confidentialité des informations (y compris le savoir-faire et les secrets commerciaux) et tous
          les autres droits de propriété intellectuelle, y compris toutes les demandes (et les droits de demander et
          d’obtenir), le renouvellement ou l’extension de ces droits et de tous les droits ou formes de protection
          similaires ou équivalents qui subsistent ou subsisteront, maintenant ou à l’avenir, dans n’importe quelle
          partie du monde;
        </Text>
        <Text style={styles.paragraph}>
          Durée : la durée correspond à la durée du programme lancé, tout mois entamé étant dû ;
        </Text>
        <Text style={styles.paragraph}>
          Frais : Le Client a sélectionné le montant des frais par rapport à la Durée tel que sélectionné sur la page
          d’abonnement et facturé ;
        </Text>
        <Text style={styles.paragraph}>
          Logiciel ou Plate-forme : tout logiciel appartenant à RewardzAi ou faisant l’objet d’une licence et faisant
          partie du Service ;
        </Text>
        <Text style={styles.paragraph}>
          Membre : Le membre est l’entreprise qui s’inscrit comme membre de la communauté RewardzAi sans souscrire à un
          service en vertu du présent Accord. Une personne physique n’est pas habilitée à devenir membre si elle n’agit
          pas pour le compte d’une société ;
        </Text>
        <Text style={styles.paragraph}>
          Service : le Service devant être fourni par RewardzAi consistant en la fourniture d’un accès à la Plate-forme
          sur une base logicielle (SaaS) ;
        </Text>
        <Text style={styles.paragraph}>
          Souscription : Acceptation complète par le représentant du Client des Conditions Générales applicables au
          Contrat
        </Text>
        <Text style={styles.paragraph}>
          Tiers de confiance : toute entreprise tierce désignée comme acceptée par RewardzAi exerçant l’activité
          réglementée ;
        </Text>
        <Text style={styles.paragraph}>
          RewardzAi : la société RewardzAi SAS, sise au 129 avenue Gabriel Peri 94170 Le Perreux sur Marne
        </Text>
        <Text style={styles.paragraph}>
          Utilisateur ou Utilisateur Autorisé : toute personne physique désignée par le Client comme utilisateur ou
          utilisateur potentiel de la Plateforme ;
        </Text>
        <Text style={styles.paragraph}>1.2 Interprétation</Text>
        <Text style={styles.paragraph}>
          Au sein du présent Accord (y compris l’introduction et les annexes), à moins que le contexte exige autrement :
        </Text>
        <Text style={styles.paragraph}>
          a) la référence à une personne comprend une personne morale (telle qu’une société à responsabilité limitée)
          ainsi qu’une personne physique ;
        </Text>
        <Text style={styles.paragraph}>
          b) les titres des articles ne sont utilisés qu’à des fins de commodité et n’ont aucune incidence sur
          l’interprétation du présent accord ;
        </Text>
        <Text style={styles.paragraph}>
          c) la mention de “notamment“ ou d’autres termes similaires dans le présent accord sera considérée comme étant
          à titre d’exemple et ne limitera pas l’applicabilité générale des mots précédents;
        </Text>
        <Text style={styles.paragraph}>
          d) toute référence à une législation est faite à cette législation telle qu’elle a été modifiée, prolongée ou
          réédictée de temps à autre et à toute disposition subordonnée prise en vertu de cette législation; et
        </Text>
        <Text style={styles.paragraph}>e) les mots au singulier comprennent le pluriel et vice versa.</Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>2. OBJET DU SERVICE</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          2.1 L’objet du Service est de fournir une assistance technique au Client pour créer et gérer des programmes de
          fidélisation, de défi et de parrainage via la Plateforme. Le Client demeure seul responsable du respect de
          toute loi applicable dans les juridictions du Client et des Utilisateurs autorisés.
        </Text>
        <Text style={styles.paragraph}>
          2.2 Afin d’accéder au Service, le Client doit fournir et enregistrer des informations via le site Web de
          RewardzAi. Le client garantit que tous les renseignements et les déclarations présentés sont complets, exacts
          et véridiques.
        </Text>
        <Text style={styles.paragraph}>
          2.3 Le Logiciel permet au Client de gérer via la Plateforme un Compte de Cantonnement ouvert par le Client via
          la Plateforme afin de récompenser l’Utilisateur Autorisé par un paiement direct du Client à l’Utilisateur
          Autorisé. Le Client reste responsable de procéder au paiement dans le cadre du Logiciel. RewardzAi n’est pas
          responsable de tout paiement au client ou à l’utilisateur autorisé.
        </Text>
        <Text style={styles.paragraph}>
          2.4 Après la Date d’Entrée en Vigueur et le paiement des Frais applicables, RewardzAi fournira l’accès au
          Service pour le Client (y compris ses Utilisateurs Autorisés) en ce qui concerne le Logiciel auquel il est
          autorisé à accéder et à utiliser en vertu du présent accord. Le Service est soit (i)« RewardzAi Standard » qui
          permet l’utilisation de la Plateforme pour le Client uniquement et les Bénéficiaires avec support technique
          standard inclus, soit (ii) Toooodoooo Superadmin qui permet à plusieurs entreprises d’accéder à l’utilisation
          de la Plateforme sous l’administration du Client, un nombre illimité d’Utilisateurs Autorisés et une
          assistance technique à l’intégration.
        </Text>
        <Text style={styles.paragraph}>
          2.5 Il incombe au Client de s’assurer qu’il dispose d’un équipement (de spécification appropriée et compatible
          avec le Logiciel et le Service) et d’une connexion Internet permettant au Client de se connecter au Service.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>3. GESTION DE LA PLATEFORME</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          Le Client peut créer et gérer des programmes de fidélisation, de défi et de parrainage pour les membres de sa
          communauté via la Plateforme. Le Client importe et gère toutes les données, personnelles et non personnelles
          en tant que responsable de traitement des données aux fins du programme fourni par RewardzAi en tant que
          sous-traitant des données.
        </Text>
        <Text style={styles.paragraph}>
          Le Client mettra en place un scénario et un nombre de crédits accordés une fois l’objectif défini atteint. Une
          fois la configuration terminée, l’engagement du Client envers sa communauté est généré par la Plateforme et
          peut être partagé par le Client avec ses membres de la communauté.
        </Text>
        <Text style={styles.paragraph}>
          Les crédits peuvent être convertis en récompenses sous réserve des conditions définies par le Client. La
          conversion peut être établie comme étant discrétionnaire en tout temps ou à une date précise prédéfinie.
        </Text>
        <Text style={styles.paragraph}>
          Les récompenses sont déclenchées par l’instruction du client au moyen d’une instruction sur le Compte de
          Cantonnement transmise via la Plateforme à un Membre de la communauté du Client qui détient un compte
          personnel ouvert auprès du même opérateur de compte de dépôt en fiducie.
        </Text>
        <Text style={styles.paragraph}>Le Client veille à ce que son Compte Cantonnement soit approvisionné.</Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>4. MISES À JOUR ET DISPONIBILITÉ</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          4.1 Le Client reconnaît que de temps à autre RewardzAi peut mettre à jour le Logiciel et/ou le Service, et que
          ces Mises à jour RewardzAi peuvent entraîner des modifications de l’apparence et/ou des fonctionnalités du
          Logiciel et/ou du Service.
        </Text>
        <Text style={styles.paragraph}>
          4.2 Le cas échéant, et sous réserve de l’article 15, RewardzAi à un taux de disponibilité du Service 99,5% du
          temps (“taux de disponibilité du service“) à l’exclusion des Événements de Force Majeure. En cas de
          non-respect par RewardzAi de cette Norme de Disponibilité du Service, le Client n’aura droit à aucun
          remboursement des Frais.
        </Text>
        <Text style={styles.paragraph}>
          4.3 RewardzAi peut fournir des services de supports du Logiciel et/ou du Service par tout canal de son choix
          sans engagement de délais de réponses. Si le Client a besoin de services de support supplémentaires, il devra
          conclure un accord de support séparé avec RewardzAi.
        </Text>
        <Text style={styles.paragraph}>
          4.4 Sous réserve de l’article 4.3 et de tout accord sur les niveaux de service (« SLA ») dans la mesure où les
          parties ont conclu un tel SLA. RewardzAi peut émettre des modifications au Logiciel et/ou au Service au moyen
          d’un correctif local du Logiciel et/ou du Service ou d’une autre solution appropriée à la discrétion absolue
          de RewardzAi. RewardzAi se réserve le droit de facturer toute modification, nouvelle version et/ou nouvelle
          version du Logiciel et/ou du Service.
        </Text>
        <Text style={styles.paragraph}>
          4.5 Le Client ne sera pas autorisé à utiliser une autre entreprise pour maintenir le Logiciel et/ou le
          Service.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>5. LICENCE ET ÉTENDUE D’UTILISATION</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          5.1 Sous réserve du paiement intégral des Frais applicables, et en contrepartie des obligations mutuelles des
          parties en vertu du présent Accord, le Client se voit accorder une licence non transférable, non exclusive,
          révocable et limitée pour la durée d’accès et d’utilisation, et permettre aux Utilisateurs Autorisés d’accéder
          et d’utiliser le Service pour la Durée.
        </Text>
        <Text style={styles.paragraph}>
          5.2 Sans préjudice des articles 2.2 et 5.1, le Client ne peut sous-concéder le droit d’accès et/ou
          d’utilisation d’un Logiciel ou du Service à un tiers que dans les conditions énoncées ci-dessus dans la
          section 2.3. Le Client est autorisé à accéder et à utiliser uniquement le Logiciel dans le cadre du Service.
          Sauf disposition expresse du présent contrat, tous les droits relatifs au Logiciel et au Service (y compris le
          Contenu RewardzAi mais à l’exclusion des Données du Client) sont réservés à RewardzAi.
        </Text>
        <Text style={styles.paragraph}>5.3 En ce qui concerne le champ d’utilisation :</Text>
        <Text style={styles.paragraph}>
          a) aux fins de l’article 5.1, l’utilisation du Logiciel et/ou du Service sera limitée à l’utilisation du
          Logiciel sous forme de code objet à des fins commerciales ou non commerciales du Client;
        </Text>
        <Text style={styles.paragraph}>
          b) le Client ne peut pas utiliser le Logiciel et/ou le Service autrement que tel que spécifié dans l’article
          4.3(a) sans le consentement écrit préalable de RewardzAi, et le Client reconnaît que des frais supplémentaires
          peuvent être exigibles sur tout changement d’utilisation approuvé par RewardzAi; et
        </Text>
        <Text style={styles.paragraph}>5.4 Le client doit :</Text>
        <Text style={styles.paragraph}>
          a) se conformer à toutes les lois et à tous les règlements applicables à l’égard de ses activités en vertu du
          présent accord;
        </Text>
        <Text style={styles.paragraph}>
          b) obtenir et conserver toutes les licences, consentements et autorisations nécessaires pour que RewardzAi
          puisse s’acquitter de ses obligations en vertu du présent Accord;
        </Text>
        <Text style={styles.paragraph}>
          c) tenir un registre complet et exact de la divulgation par le Client du Logiciel, du Service et de ses
          Utilisateurs Autorisés, et produire ledit registre à RewardzAi sur demande de temps à autre ;
        </Text>
        <Text style={styles.paragraph}>
          d) informer RewardzAi dès qu’il prend connaissance de toute utilisation non autorisée du Logiciel et/ou du
          Service par une personne;
        </Text>
        <Text style={styles.paragraph}>
          e) payer, pour élargir la portée des licences accordées en vertu du présent Accord pour couvrir l’utilisation
          non autorisée par un tiers, un montant égal aux frais que RewardzAi aurait perçus (conformément à ses
          conditions commerciales normales alors en vigueur) a-t-il autorisé une telle utilisation non autorisée à la
          date à laquelle cette utilisation a commencé avec des intérêts au taux prévu à l’article 5.6 à compter de
          cette date jusqu’à la date du paiement ;
        </Text>
        <Text style={styles.paragraph}>
          f) ne pas copier, traduire, modifier, adapter ou créer des œuvres dérivées du Logiciel et/ou du Service ;
        </Text>
        <Text style={styles.paragraph}>
          g) ne pas tenter de découvrir ou d’accéder au code source du Logiciel ou de la rétro-ingénierie, modifier,
          déchiffrer, extraire, désassembler ou décompiler le Logiciel (sauf strictement dans la mesure où le Client est
          autorisé à le faire en vertu de la loi applicable dans des circonstances dans lesquelles RewardzAi n’est pas
          légalement autorisé à restreindre ou à empêcher la même chose), notamment pour :
        </Text>
        <Text style={styles.paragraph}>(i) créer un produit ou un service concurrentiel;</Text>
        <Text style={styles.paragraph}>
          (ii) créer un produit en utilisant des idées, des fonctionnalités, des fonctions ou des graphiques similaires
          du Logiciel et/ou du Service ; ou
        </Text>
        <Text style={styles.paragraph}>
          (iii) copier les idées, caractéristiques, fonctions ou graphiques du Logiciel et/ou du Logiciel;
        </Text>
        <Text style={styles.paragraph}>
          h) ne pas tenter d’interférer avec le bon fonctionnement du Logiciel et/ou du Service et, en particulier, ne
          doit pas tenter de contourner la sécurité, le contrôle des licences ou d’autres mécanismes de protection, ni
          trafiquer, pirater ou autrement perturber le Logiciel, le Service ou tout site Web associé, système
          informatique, serveur, routeur ou tout autre dispositif connecté à Internet;
        </Text>
        <Text style={styles.paragraph}>
          (i) ne pas introduire de virus ou d’autres logiciels malveillants susceptibles d’infecter ou d’endommager le
          Logiciel et/ou le Service ;
        </Text>
        <Text style={styles.paragraph}>
          j) ne pas masquer, modifier ou supprimer un avis de droit d’auteur, une marque commerciale ou toute autre
          marque de propriété sur le Logiciel et/ou le Service ou pendant leur utilisation ;
        </Text>
        <Text style={styles.paragraph}>
          k) de ne pas revendre le Logiciel ou le Service à des tiers ou de ne pas permettre à un tiers de le faire à
          moins que cela ne soit autorisé par un accord de revendeur entre RewardzAi et le Client ;
        </Text>
        <Text style={styles.paragraph}>
          (l) ne pas, et garantit qu’il ne doit pas (soit lui-même ou par l’intermédiaire de ses Utilisateurs
          Autorisés), utiliser ou télécharger des données à caractère personnel sur le Service, sauf consentement
          explicite des personnes concernées;
        </Text>
        <Text style={styles.paragraph}>m) ne pas utiliser le Logiciel et/ou le Service :</Text>
        <Text style={styles.paragraph}>
          (i) télécharger, stocker, publier, envoyer par courriel, transmettre ou autrement rendre accessible tout
          contenu qui porte atteinte aux droits de propriété intellectuelle ou à la protection des données, à la vie
          privée ou à d’autres droits de toute autre personne, qui est diffamatoire ou qui contrevient à un devoir
          contractuel ou à une obligation de confiance, est obscène, sexuellement explicite, menaçant, incitant à la
          violence ou à la haine, blasphématoire, discriminatoire (pour quelque motif que ce soit), sciemment faux ou
          trompeur, ou qui ne respecte pas toutes les lois et réglementations applicables ou qui est autrement
          répréhensible ou interdit tel qu’énoncé dans toute politique d’utilisation acceptable publiée en ligne via le
          Logiciel, telle que mise à jour par RewardzAi de temps à autre (“Contenu interdit“);
        </Text>
        <Text style={styles.paragraph}>
          (ii) se faire passer pour une personne ou une entité ou présenter de manière fausse la relation du client avec
          une personne ou une entité ;
        </Text>
        <Text style={styles.paragraph}>
          (iii) de se livrer à toute activité frauduleuse ou à toute fin frauduleuse ou de fournir un soutien matériel
          ou des ressources à toute organisation désignée comme organisation terroriste étrangère;
        </Text>
        <Text style={styles.paragraph}>
          (iv) fournir de fausses informations d’identité pour accéder ou utiliser le Logiciel et/ou le Service ; et/ou
        </Text>
        <Text style={styles.paragraph}>
          (v) de collecter ou de stocker des données à caractère personnel concernant d’autres utilisateurs dans le
          cadre des activités et des comportements interdits décrits ci-dessus.
        </Text>
        <Text style={styles.paragraph}>
          et ne permet à aucun Utilisateur Autorisé ou à un autre tiers de faire l’une ou l’autre des opérations
          ci-dessus.
        </Text>
        <Text style={styles.paragraph}>5.5 Le Client ne doit pas :</Text>
        <Text style={styles.paragraph}>
          a) céder ou remplacer l’avantage ou le fardeau du présent Accord en tout ou en partie;
        </Text>
        <Text style={styles.paragraph}>
          b) permettre au Logiciel et/ou au Service de faire l’objet de toute charge, privilège ou charge ; et
        </Text>
        <Text style={styles.paragraph}>
          c) s’occuper de toute autre manière de ses droits et obligations en vertu du présent Accord;
        </Text>
        <Text style={styles.paragraph}>sans le consentement écrit préalable de RewardzAi.</Text>
        <Text style={styles.paragraph}>
          5.6 RewardzAi peut à tout moment sous-concéder, céder, nover, facturer ou traiter de toute autre manière avec
          l’un ou l’autre de ses droits et obligations en vertu du présent accord, à condition de donner un avis écrit
          au client.
        </Text>
        <Text style={styles.paragraph}>
          5.7 Le Client se conformera aux conditions d’utilisation, à la politique d’utilisation acceptable, à la
          politique de confidentialité et/ou à la politique sur les cookies que RewardzAi peut publier en ligne via le
          Service, chacune mise à jour par RewardzAi de temps à autre, qui sont toutes incorporées dans le présent accord
          par référence.
        </Text>
        <Text style={styles.paragraph}>
          5.8 Le Client est responsable de l’accès et de l’utilisation du Logiciel et/ou du Service par les Utilisateurs
          Autorisés. Le Client s’assurera que tous les Utilisateurs Autorisés respectent les termes du présent contrat,
          y compris leur obligation de se conformer à toutes les autres conditions d’utilisation applicables au Service
          et notifiées au Client. Le Client ne donnera accès au Service qu’aux Utilisateurs Autorisés par le moyen
          d’accès fourni par RewardzAi et ne donnera accès à personne d’autre qu’un Utilisateur Autorisé. Le Client
          notifiera immédiatement RewardzAi au cas où le Client aurait connaissance d’une violation de cet accord par un
          Utilisateur Autorisé.
        </Text>
        <Text style={styles.paragraph}>
          5.9 Le Client est responsable de la sécurité et de la confidentialité de tous les identifiants de connexion, y
          compris les noms d’utilisateur et les mots de passe, attribués ou créés par, le Client ou l’Utilisateur
          Autorisé afin qu’il ou ses Utilisateurs Autorisés puissent accéder ou utiliser le Logiciel et/ou le Service
          (“ID“). Le client reconnaît et convient qu’il sera seul responsable de toutes les activités qui se dérouleront
          en vertu de cette pièce d’identité. Le Client notifiera rapidement RewardzAi dès qu’il aura connaissance d’un
          accès ou d’une utilisation non autorisée du Logiciel et/ou du Service, et fournira toute l’assistance
          raisonnable à RewardzAi pour mettre fin à cet accès ou à cette utilisation non autorisée.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>6. FRAIS, FACTURATION ET PAIEMENT</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          6.1 Sous réserve de l’article 6.2, le Client devra payer les Frais à l’avance pour la Durée du Service tous
          les 6 mois ou tous les ans, sauf accord contraire par écrit.
        </Text>
        <Text style={styles.paragraph}>
          6.2 Toutes les sommes dues en vertu du présent accord sont hors TVA ou taxes de vente locales applicables,
          dont le Client est responsable.
        </Text>
        <Text style={styles.paragraph}>
          6.3 Si le Client omet d’effectuer tout paiement dû à RewardzAi en vertu du présent Accord avant la date
          d’échéance du paiement, le Client remboursera à RewardzAi tous les frais raisonnables engagés par RewardzAi pour
          le recouvrement des paiements en retard ou des intérêts, y compris les frais d’avocat, les frais de justice et
          de recouvrement; et si ce manquement persiste pendant quinze (15) jours après en avoir été avisé par écrit,
          RewardzAi peut suspendre l’exécution du Service jusqu’à ce que tous les montants en souffrance et les intérêts
          y afférents aient été payés, sans encourir aucune obligation ou responsabilité envers le Client ou toute autre
          Personne en raison d’une telle suspension. De plus, RewardzAi peut facturer des intérêts sur le montant en
          souffrance au taux de trois fois le taux d’intérêt légal pour les transactions commerciales. En outre, en
          application des articles L. 441-10 et D. 441-5 du Code de commerce, le Client versera une indemnité
          forfaitaire de quarante (40€) euros pour les frais de recouvrement par facture, sans préavis, et sans
          préjudice des dommages que le Prestataire se réserve le droit de solliciter de manière judiciaire ; Le Client
          remboursera au Fournisseur tous les coûts raisonnables engagés par le Fournisseur pour recouvrer les paiements
          en retard ou les intérêts, y compris les honoraires d’avocat, les frais de justice et les frais d’agence de
          recouvrement; et si ce manquement se poursuit pendant quinze (15) jours après en avoir été avisé par écrit, le
          Prestataire peut suspendre l’exécution de la Prestation jusqu’à ce que tous les montants en souffrance et les
          intérêts y afférents aient été payés, sans encourir aucune obligation ou responsabilité envers le Client ou
          toute autre Personne en raison d’une telle suspension.
        </Text>
        <Text style={styles.paragraph}>
          6.4 Aucune retenue ou compensation. Tous les montants payables au Fournisseur en vertu de la présente
          Convention seront payés par le Client au Fournisseur en totalité sans compensation, recouvrement, demande
          reconventionnelle, déduction, débit ou retenue pour quelque raison que ce soit et sont la propriété du
          fournisseur et non remboursables.
        </Text>
        <Text style={styles.paragraph}>
          6.5 Les frais peuvent être révisés et augmentés par RewardzAi sur préavis d’un mois civil, cette augmentation
          devant entrer en vigueur le mois civil suivant, sauf accord contraire.
        </Text>
        <Text style={styles.paragraph}>
          6.6 Les frais peuvent être payés par carte de crédit ou de débit, ou par toute autre méthode mutuellement
          convenue entre les parties.
        </Text>
        <Text style={styles.paragraph}>
          6.7 Les honoraires sont payables, en totalité, sans déduction, compensation ou retenue d’aucune sorte. En cas
          de différend sur le montant d’une facture, le client doit payer le montant en entier en attendant le règlement
          de tout différend et RewardzAi doit procéder à tout ajustement dû immédiatement après cette résolution.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>7. CONFIDENTIALITÉ ET PUBLICITÉ</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          7.1 Chaque partie doit, pendant la durée du présent Accord et par la suite, garder tous les renseignements
          confidentiels et ne doit pas les utiliser à ses propres fins (sauf pour la mise en œuvre du présent Accord) ni
          sans le consentement écrit préalable de l’autre partie. (à l’exception de ses conseillers professionnels ou de
          toute loi ou autorité légale ou réglementaire) tout renseignement de nature confidentielle (y compris les
          secrets commerciaux et les renseignements à valeur commerciale) qui peuvent devenir connues de l’autre partie
          et qui se rapportent à l’autre partie ou à l’une de ses affiliées, à moins que ces renseignements ne soient
          connus du public ou ne soient déjà connus de cette partie au moment de la divulgation, ou devient par la suite
          de notoriété publique autrement que par violation du présent Accord, ou par la suite entre légalement en
          possession de cette partie par un tiers. Chaque partie s’efforce d’empêcher la divulgation non autorisée de
          ces renseignements.
        </Text>
        <Text style={styles.paragraph}>
          7.2 Sous réserve des articles 7.3 et 7.4, l’une ou l’autre des parties est autorisée à faire, ou à permettre à
          quiconque de faire, une annonce publique concernant la présente entente, sans le consentement écrit préalable
          des autres parties, sauf entente contraire.
        </Text>
        <Text style={styles.paragraph}>
          7.3 Le Client devra afficher le logo “Powered by RewardzAi“ et/ou le logo RewardzAi sur ses communications aux
          Utilisateurs Autorisés.
        </Text>
        <Text style={styles.paragraph}>
          7.4 RewardzAi se réserve le droit d’utiliser des descriptions et/ou des exemples de l’utilisation du Logiciel
          et/ou du Service par le Client dans ses communiqués de presse, ses canaux de marketing et tout autre matériel
          publicitaire. RewardzAi peut également faire référence au site Web du Client et créer un lien vers celui-ci.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>8. Exporter</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          8.1 Aucune des parties n’exportera, directement ou indirectement, des données techniques acquises de l’autre
          partie en vertu du présent accord (ou de tout produit, y compris un logiciel, incorporant ces données) en
          violation de toute loi ou réglementation applicable, y compris les lois et règlements des États-Unis sur
          l’exportation, vers tout pays pour lequel le gouvernement ou un organisme gouvernemental au moment de
          l’exportation exige une licence d’exportation ou une autre approbation gouvernementale, sans obtenir au
          préalable cette licence ou approbation.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>9. Droits de propriété intellectuelle</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          9.1 Aucune disposition du présent Accord ne fait en sorte que la propriété des droits de propriété
          intellectuelle appartenant à une partie soit transférée à l’autre.
        </Text>
        <Text style={styles.paragraph}>
          9.2 RewardzAi et/ou ses concédants de licence resteront, entre les parties, propriétaires de tous les droits de
          propriété intellectuelle sur les marques, marques et logos de RewardzAi, le Logiciel et le Service (y compris
          le Contenu de RewardzAi mais à l’exclusion des Données du Client). Sauf autorisation expresse du présent
          contrat, le Client ne peut utiliser aucun des Droits de Propriété Intellectuelle de RewardzAi sans le
          consentement écrit préalable de RewardzAi.
        </Text>
        <Text style={styles.paragraph}>
          9.3 Le Client reconnaît qu’il peut créer des Droits de Propriété Intellectuelle en améliorant ou en suggérant
          des améliorations du Logiciel. Toutes les améliorations au Logiciel ou au Service suggérées par le Client et
          développées par RewardzAi qui entraînent la création de droits de propriété intellectuelle appartiennent à
          RewardzAi. Par les présentes, le Client cède à RewardzAi tous les droits de propriété intellectuelle relatifs au
          Logiciel, au Service et renonce à ses droits moraux à cet égard. Le Client doit signer et remettre les
          documents et accomplir les actes nécessaires pour donner plein effet au présent article 9.3.
        </Text>
        <Text style={styles.paragraph}>
          9.4 Le Client est tenu dans les meilleurs délais de porter à l’attention de RewardzAi toute utilisation
          inappropriée ou injustifiée des Droits de Propriété Intellectuelle de RewardzAi qui est portée à la
          connaissance du Client. Le client doit aider RewardzAi à prendre toutes les mesures nécessaires pour défendre
          ses droits de propriété intellectuelle, mais il ne doit pas intenter de poursuites judiciaires de son propre
          chef.
        </Text>
        <Text style={styles.paragraph}>
          9.5 Le Client et/ou ses concédants de licence resteront, entre les parties, propriétaires de tous les Droits
          de Propriété Intellectuelle sur les Données du Client. Le Client n’accorde à RewardzAi, gratuitement, une
          licence mondiale et non exclusive d’utilisation des Données du Client que dans la mesure nécessaire pour
          permettre à RewardzAi de fournir le Service et d’exécuter ses obligations en vertu du présent contrat.
        </Text>
        <Text style={styles.paragraph}>
          9.6 Le Client garantit que le Client possède ou a obtenu une licence à l’égard des Données du Client et est
          par ailleurs habilité à accorder la licence dans l’article8.6. Si cette entente est résiliée, la licence
          accordée à RewardzAi dans l’article9.5 prendra automatiquement fin.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>10. PROTECTION DES DONNÉES</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          10.1 Dans le cadre de l’exécution de la Prestation Le Client peut collecter et traiter des données à caractère
          personnel via le Logiciel.
        </Text>
        <Text style={styles.paragraph}>
          À cet égard, il est convenu entre les parties que RewardzAi peut être qualifié de Sous-traitant de données et
          le Client en tant que Responsable de traitement au sens du règlement (UE) 2016/679 du Parlement européen et du
          Conseil du 27 avril 2016 (“RGPD“). Les deux Parties se conforment aux règles et réglementations obligatoires
          relatives à toute loi et réglementation applicable en matière de confidentialité des données.
        </Text>
        <Text style={styles.paragraph}>
          Responsable du traitement, sous-traitant, personne concernée, données à caractère personnel, violation de
          données à caractère personnel, traitement et mesures techniques et organisationnelles appropriées telles que
          définies dans la législation applicable en matière de protection des données.
        </Text>
        <Text style={styles.paragraph}>
          10.2 Les parties reconnaissent que lorsque RewardzAi traite des données à caractère personnel, c’est pour le
          compte du Client dans l’exécution de ses obligations en vertu du présent Contrat. Par conséquent, le Client
          est le responsable du traitement et RewardzAi est le sous-traitant aux fins de la loi et de la réglementation
          applicables en matière de protection des données.
        </Text>
        <Text style={styles.paragraph}>
          RewardzAi traite les Données à caractère personnel transférées sur la Plateforme par le Client ou un
          Utilisateur Autorisé conformément aux instructions du Client dans un but précis, explicite et légitime, de
          collecter des données de manière équitable et légale, et de collecter des données pertinentes, données
          précises et non exhaustives.
        </Text>
        <Text style={styles.paragraph}>
          RewardzAi s’abstient de collecter et de traiter des données à caractère personnel à des fins différentes. Le
          Client reste à tout moment le seul Data Controler pour les Données du Client
        </Text>
        <Text style={styles.paragraph}>
          10.3 Sans préjudice du principe de l’article 10.2, le Client s’assurera qu’il dispose de tous les
          consentements et avis appropriés en place pour permettre le transfert des données à caractère personnel à
          RewardzAi (ou la collecte des données à caractère personnel par RewardzAi sur le Client) pendant la durée et aux
          fins du présent accord, afin que RewardzAi puisse légalement utiliser, traiter et transférer les données à
          caractère personnel conformément au présent accord pour le compte du Client.
        </Text>
        <Text style={styles.paragraph}>
          10.4 Sans préjudice de la généralité de l’article 9.2, RewardzAi doit, en ce qui concerne les données à
          caractère personnel traitées dans le cadre de l’exécution par RewardzAi de ses obligations en vertu du présent
          accord :
        </Text>
        <Text style={styles.paragraph}>
          a) S’assurer qu’il a mis en place des mesures techniques et organisationnelles appropriées, examinées et
          approuvées par le Client, pour se protéger contre le traitement non autorisé ou illégal de données à caractère
          personnel et contre la perte ou la destruction accidentelle ou l’endommagement de données à caractère
          personnel, approprié au préjudice qui pourrait résulter du traitement non autorisé ou illégal ou de la perte,
          destruction ou dommage accidentel et de la nature des données à protéger, compte tenu de l’état de l’évolution
          technologique et du coût de mise en œuvre de toute mesure (ces mesures peuvent inclure, le cas échéant, la
          pseudonymisation et le cryptage des données à caractère personnel, en assurant la confidentialité,
          l’intégrité, la disponibilité et la résilience de ses systèmes et services, veiller à ce que la disponibilité
          et l’accès aux données à caractère personnel puissent être rétablis en temps utile après un incident, et
          évaluer régulièrement l’efficacité des mesures techniques et organisationnelles adoptées par celui-ci);
        </Text>
        <Text style={styles.paragraph}>
          b) Ne pas transférer de données à caractère personnel en dehors de l’Espace économique européen, sauf si les
          conditions suivantes sont remplies :
        </Text>
        <Text style={styles.paragraph}>
          (i) Le Client ou RewardzAi a fourni des garanties appropriées en ce qui concerne le transfert;
        </Text>
        <Text style={styles.paragraph}>
          (ii) La personne concernée dispose de droits exécutoires et de voies de recours efficaces;
        </Text>
        <Text style={styles.paragraph}>
          (iii) RewardzAi respecte ses obligations en vertu de la législation applicable en matière de protection des
          données en assurant un niveau de protection adéquat à toutes les données à caractère personnel qui sont
          transférées; et
        </Text>
        <Text style={styles.paragraph}>
          (iv) RewardzAi se conforme aux instructions raisonnables qui lui sont notifiées à l’avance par le Client en ce
          qui concerne le traitement des données à caractère personnel;
        </Text>
        <Text style={styles.paragraph}>
          c) Aider le Client, aux frais du Client, à répondre à toute demande d’une personne concernée et à assurer le
          respect de ses obligations en vertu de la législation applicable en matière de protection des données en
          matière de sécurité, d’avis de violation, les évaluations d’impact et les consultations avec les autorités de
          surveillance ou les organismes de réglementation ;
        </Text>
        <Text style={styles.paragraph}>
          d) Informer le Client sans retard indu dès qu’il prend connaissance d’une violation de données à caractère
          personnel ;
        </Text>
        <Text style={styles.paragraph}>
          e) Sur instruction écrite du Client, supprimer ou retourner les données à caractère personnel et leurs copies
          au Client à la résiliation du contrat, sauf si la législation applicable en matière de protection des données
          à caractère personnel l’exige ; et
        </Text>
        <Text style={styles.paragraph}>
          f) Tenir des registres et des informations complets et exacts afin de démontrer sa conformité au présent
          article 10 et informer immédiatement le Client si, de l’avis de RewardzAi, une instruction contrevient à la
          législation applicable en matière de protection des données.
        </Text>
        <Text style={styles.paragraph}>
          10.8 Chaque partie doit obtenir et maintenir tous les enregistrements appropriés requis en vertu de la
          législation sur la protection des données afin de permettre à cette partie d’exécuter ses obligations en vertu
          du présent accord.
        </Text>
        <Text style={styles.paragraph}>
          10.9 Le Client reconnaît et convient que RewardzAi peut utiliser des données agrégées dérivées de l’utilisation
          du Logiciel et du Service par le Client aux présentes, à condition que RewardzAi ait rendu ces données
          anonymes. RewardzAi peut utiliser aux fins de marketing et publicité le nombre total d’utilisateurs, le nombre
          total de dossiers de réclamation stockés, le volume total de transactions et d’autres statistiques agrégées
          pour attirer de nouveaux clients.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>11. GARANTIES DU FOURNISSEUR</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>11.1 RewardzAi garantit que :</Text>
        <Text style={styles.paragraph}>
          a) il a le droit de conclure le présent accord et de fournir le Service comme le prévoit le présent accord ;
          et
        </Text>
        <Text style={styles.paragraph}>
          b) le Logiciel et le Service doivent, dans des conditions de fonctionnement normales, être essentiellement
          conformes aux fonctionnalités décrites dans la documentation sur le site Web de RewardzAi (qui peut être mis à
          jour de temps à autre).
        </Text>
        <Text style={styles.paragraph}>
          11.2 Si l’une des garanties de l’article 11.1 est violée, le client doit en informer RewardzAi dès que
          possible. Le Client doit accorder à RewardzAi un délai raisonnable pour résoudre le problème, y compris (à la
          discrétion de RewardzAi) en mettant à disposition une version corrigée du Logiciel et/ou du Service (selon le
          cas) ou une manière raisonnable de contourner le problème qui n’est pas matériellement préjudiciable au Client
          et/ou en réexécutant tout service pertinent. Cela se fera sans frais supplémentaires pour le client. Si
          RewardzAi est en mesure de le faire dans un délai raisonnable, ce sera le seul et unique recours du Client à
          l’égard de cette violation et RewardzAi, sous réserve de l’article 12, n’aura aucune autre obligation ou
          responsabilité à l’égard de cette violation.
        </Text>
        <Text style={styles.paragraph}>
          11.3 RewardzAi ne garantit pas que l’utilisation du Logiciel et/ou du Service sera ininterrompue ou sans
          erreur.
        </Text>
        <Text style={styles.paragraph}>
          11.4 RewardzAi ne contrôle pas le contenu publié vers ou via le Service et, en particulier, ne contrôle pas ou
          ne surveille pas activement les Données du Client et, à ce titre, RewardzAi ne fait ni ne donne aucune
          déclaration ni garantie quant à l’exactitude, l’exhaustivité, la validité, l’exactitude, la fiabilité,
          l’intégrité, l’utilité, la qualité, l’adéquation au but ou à l’originalité du contenu ou des données
          susmentionnés. En cas de violation présumée d’article 8, 9 ou 10, RewardzAi aura le droit de supprimer les
          Données du Client du Service sans avoir à consulter le Client.
        </Text>
        <Text style={styles.paragraph}>
          11.5 Le Client accepte la responsabilité du choix du Logiciel et du Service pour atteindre les résultats
          escomptés et reconnaît que le Logiciel et/ou le Service n’ont pas été développés pour répondre aux exigences
          individuelles du Client.
        </Text>
        <Text style={styles.paragraph}>
          11.6 Toutes les autres conditions, garanties ou autres modalités qui pourraient avoir un effet entre les
          parties ou être implicites ou incorporées dans le présent accord ou tout contrat accessoire sont par les
          présentes exclues, y compris les conditions implicites, garanties ou autres conditions quant à la qualité
          satisfaisante, l’aptitude à l’emploi ou l’utilisation d’une compétence et de soins raisonnables.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>12. INDEMNISATION CONTREFACON</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          12.1 Le client doit indemniser RewardzAi et ses sociétés affiliées de tous les passifs, coûts, dépenses,
          dommages ou pertes (y compris les pertes directes ou indirectes, la perte de profit, la perte de réputation et
          tous les intérêts, pénalités et frais juridiques (calculés sur la base d’une indemnité complète) et tous les
          autres frais et dépenses professionnels) subis ou encourus par le RewardzAi découlant ou en rapport avec :
        </Text>
        <Text style={styles.paragraph}>
          a) toute allégation selon laquelle les Données du Client enfreignent les droits de propriété intellectuelle
          d’un tiers ;
        </Text>
        <Text style={styles.paragraph}>
          b) toute réclamation selon laquelle les Données du Client ont été obtenues sans le consentement exprès de la
          personne concernée et/ou en violation de la Législation sur la protection des données ; ou
        </Text>
        <Text style={styles.paragraph}>
          c) toute réclamation d’un tiers résultant de l’utilisation du Logiciel et/ou du Service par le Client ou son
          Utilisateur Autorisé ;
        </Text>
        <Text style={styles.paragraph}>chacun un “RewardzAi Claim“.</Text>
        <Text style={styles.paragraph}>
          12.2 Sous réserve de l’article 12, RewardzAi indemnisera le Client contre tous les dommages et frais juridiques
          finalement adjugés contre le Client par un tribunal compétent et/ou les montants payés par le Client à la
          suite d’un règlement final approuvé par RewardzAi, ainsi que les frais juridiques connexes raisonnablement
          engagés par le Client, en raison de toute réclamation par un tiers que l’accès et l’utilisation, conformément
          au présent accord, par le Client du Logiciel ou du Service, à l’exclusion du Logiciel Open-Source, viole les
          Droits de Propriété Intellectuelle de tout tiers (“Réclamation du Client“). Cette indemnité ne s’applique
          qu’aux réclamations du Client étayées par un jugement de justice. Il ne s’applique pas aux réclamations
          alléguées du client. Pour éviter toute ambiguïté, l’article 11.2 ne s’applique pas lorsque la Réclamation du
          Client en question est imputable à la possession ou à l’utilisation du Logiciel ou du Service (ou d’une partie
          de celui-ci) par le Client autrement que conformément aux termes du présent accord, l’utilisation du Logiciel
          et/ou du Service en combinaison avec tout matériel ou logiciel non fourni ou spécifié par RewardzAi si
          l’infraction aurait été évitée par l’utilisation du Logiciel ou des Services non combinés, ou l’utilisation
          d’une version non courante du Logiciel ou du Service.
        </Text>
        <Text style={styles.paragraph}>
          12.3 Aux fins du présent article 12.3, une réclamation RewardzAi et une réclamation du client sont considérées
          comme une « réclamation ». Si un tiers fait une réclamation ou notifie son intention de faire une réclamation
          contre une partie, les obligations de l’indemnisateur sont conditionnelles à ce que l’indemnisé :
        </Text>
        <Text style={styles.paragraph}>
          a) dès que cela est raisonnablement possible, en donnant un avis écrit de la réclamation à l’indemnisé, en
          précisant la nature de la réclamation de façon suffisamment détaillée;
        </Text>
        <Text style={styles.paragraph}>
          b) ne pas faire d’admission de responsabilité, d’accord ou de compromis à l’égard de la réclamation sans le
          consentement écrit préalable de l’indemnisateur (ce consentement ne doit pas être conditionné, retenu ou
          retardé de façon déraisonnable); et
        </Text>
        <Text style={styles.paragraph}>
          c) donner à l’indemnisateur et à ses conseillers professionnels un accès raisonnable (sur préavis raisonnable)
          aux locaux, aux dirigeants, aux administrateurs, aux employés, aux mandataires, aux représentants ou aux
          conseillers aux fins de l’évaluation de la réclamation.
        </Text>
        <Text style={styles.paragraph}>
          12.4 Si une réclamation du client est faite, ou à l’avis raisonnable de RewardzAi, une réclamation est
          susceptible d’être faite contre le client, RewardzAi peut, à sa seule option et à ses frais :
        </Text>
        <Text style={styles.paragraph}>
          a) procurer au Client le droit de continuer à utiliser le Logiciel et/ou le Service (ou toute partie de
          celui-ci) conformément aux termes du présent contrat ;
        </Text>
        <Text style={styles.paragraph}>b) modifier le Logiciel et/ou le Service afin qu’il cesse d’enfreindre ;</Text>
        <Text style={styles.paragraph}>
          c) remplacer le logiciel et/ou le service par un logiciel non contrefaisant ; ou
        </Text>
        <Text style={styles.paragraph}>
          d) résilier immédiatement le présent contrat par un avis écrit au Client et rembourser toute Taxe payée par le
          Client à la date de résiliation (moins une somme raisonnable relative à l’utilisation du Logiciel et/ou du
          Service par le Client à la date de résiliation),
        </Text>
        <Text style={styles.paragraph}>
          à condition que si RewardzAi modifie ou remplace le Logiciel et/ou le Service, le Logiciel et/ou le Service
          modifié ou de remplacement doit respecter les garanties de l’article 10 et le Client aura les mêmes droits à
          cet égard qu’il aurait eu en vertu de ces articles si les références à la date du présent contrat avaient été
          des références à la la date à laquelle cette modification ou ce remplacement a été effectué.
        </Text>
        <Text style={styles.paragraph}>
          12.5 Nonobstant toute autre disposition du présent accord, l’article12.2 ne s’applique pas dans la mesure où
          toute réclamation ou action visée par cet article découle directement ou indirectement de la possession ou de
          l’utilisation d’un logiciel tiers.
        </Text>
        <Text style={styles.paragraph}>
          12.6 Les articles 12.2 à 12.4 constituent le recours exclusif du Client et la seule responsabilité de RewardzAi
          à l’égard des Réclamations du Client et, pour éviter tout doute, est assujettie à l’article 13.1.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>13. LIMITES DE RESPONSABILITÉ</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>13.1 Sauf disposition expresse du paragraphe 13.2 :</Text>
        <Text style={styles.paragraph}>
          RewardzAi ne peut être tenu responsable que des dommages directs et prévisibles causés par une violation par le
          Fournisseur de ses obligations en vertu du Contrat.
        </Text>
        <Text style={styles.paragraph}>
          a) RewardzAi ne peut en aucun cas être tenu responsable des pertes de bénéfices; perte de revenus ou de
          bénéfices; perte de clients; perte d’occasion; perte d’image ou de réputation; la perte de tout coût lié à
          l’obtention d’un produit, d’un logiciel, d’un service ou d’une technologie de rechange; ou toute difficulté
          technique à transmettre un message via Internet.
        </Text>
        <Text style={styles.paragraph}>
          RewardzAi ne saurait être tenu responsable des pertes ou dommages résultant de la perte, de la corruption ou de
          la destruction de fichiers, d’informations, de transactions ou de données résultant de l’utilisation par le
          Client d’un ou de plusieurs éléments fournis dans le cadre de la Prestation.
        </Text>
        <Text style={styles.paragraph}>
          La responsabilité cumulée totale de RewardzAi, tous dommages confondus pour quelque raison que ce soit, ne peut
          excéder le montant total des Taxes effectivement perçues au cours des six (6) mois précédant la date de
          l’incident donnant lieu à cette responsabilité.
        </Text>
        <Text style={styles.paragraph}>
          b) RewardzAi n’est pas responsable, que ce soit dans le cadre d’un contrat, d’un délit (y compris la
          négligence), d’un manquement à une obligation légale, en vertu d’une indemnité ou autrement, de toute perte,
          de tout dommage, de toute dépense ou de toute responsabilité découlant :
        </Text>
        <Text style={styles.paragraph}>
          (i) l’utilisation du Logiciel et/ou du Service, à l’exception de son utilisation normale prévue;
        </Text>
        <Text style={styles.paragraph}>
          (ii) toute adaptation ou modification de tout Logiciel et/ou Service, ou toute intégration ou combinaison avec
          tout autre équipement, logiciel, produit ou matériel non fourni par RewardzAi, dans chaque cas effectuée par
          une personne autre que le RewardzAi ou sans le consentement écrit exprès de RewardzAi;
        </Text>
        <Text style={styles.paragraph}>
          (iii) tout défaut survenant dans le Logiciel et/ou le Service résultant d’une mauvaise utilisation, d’un
          dommage volontaire, d’une négligence de la part de toute personne autre que RewardzAi, de conditions de
          fonctionnement anormales ou de tout manquement du Client à suivre les instructions de RewardzAi quant à son
          utilisation ;
        </Text>
        <Text style={styles.paragraph}>
          (iv) la conformité de RewardzAi à toute conception, spécification ou instructions fournies par le Client ou
          pour le compte du Client ; ou
        </Text>
        <Text style={styles.paragraph}>
          (v) le Client ou un tiers (autre qu’un sous-traitant ou un représentant du Fournisseur) en ce qui concerne la
          perte ou l’endommagement des Données du Client.
        </Text>
        <Text style={styles.paragraph}>
          13.2 Les exclusions de l’article 13.1 s’appliquent dans toute la mesure permise par la loi, mais RewardzAi
          n’exclut pas la responsabilité pour :
        </Text>
        <Text style={styles.paragraph}>
          a) la mort ou les blessures corporelles causées par la négligence de RewardzAi, de ses dirigeants, employés,
          entrepreneurs ou agents;
        </Text>
        <Text style={styles.paragraph}>b) fraude ou fausse déclaration frauduleuse;</Text>
        <Text style={styles.paragraph}>
          c) payer les sommes dues au client (le cas échéant) dans le cours normal de l’exécution du présent contrat ;
          ou
        </Text>
        <Text style={styles.paragraph}>d) toute autre responsabilité qui ne peut être exclue par la loi.</Text>
        <Text style={styles.paragraph}>
          13.3 Toutes les mentions de « RewardzAi » dans le présent article 13 seulement sont considérées, aux fins du
          présent article, comme incluant tous les employés, sous-traitants et fournisseurs de RewardzAi et de ses
          sociétés affiliées, qui bénéficient tous des exclusions et limitations de responsabilité prévues au présent
          article.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>14. DURÉE ET RÉSILIATION</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          14.1 La présente entente entre en vigueur à la date d’entrée en vigueur et, à moins qu’elle ne soit résiliée
          plus tôt conformément à ses modalités, se poursuit pour la durée et se renouvelle automatiquement par la suite
          pour des modalités successives de durée équivalente (chacune étant une « durée de renouvellement »). sauf si
          et jusqu’à ce que l’une ou l’autre des parties donne un préavis écrit d’au moins 14 jours à cet effet (cet
          avis expire à la fin de la durée ou de toute période de renouvellement subséquente seulement).
        </Text>
        <Text style={styles.paragraph}>
          14.2 L’une ou l’autre des parties peut mettre fin au présent accord, à tout moment, en donnant à l’autre un
          avis écrit si :
        </Text>
        <Text style={styles.paragraph}>
          a) l’autre viole matériellement toute article du présent accord et il n’est pas possible de remédier à cette
          violation;
        </Text>
        <Text style={styles.paragraph}>
          b) l’autre partie contrevient matériellement à toute condition du présent Accord et il est possible de
          remédier à cette violation, mais l’autre ne le fait pas dans les 30 jours suivant la demande écrite de le
          faire; ou
        </Text>
        <Text style={styles.paragraph}>
          c) l’autre partie devient insolvable, compose avec ses créanciers, fait nommer un séquestre ou un
          administrateur de son entreprise ou de la totalité ou d’une partie substantielle de son actif, ou rend une
          ordonnance ou adopte une résolution efficace pour son administration, la mise sous séquestre, la liquidation,
          la liquidation ou une autre procédure semblable, ou toute autre procédure de mise sous séquestre, d’exécution
          ou de mise sous séquestre visant la totalité ou une partie substantielle de ses actifs (qui n’est pas libérée,
          versée, retirée ou retirée dans les 28 jours);, ou fait l’objet de procédures équivalentes ou
          substantiellement similaires à l’une ou l’autre de ces procédures en vertu d’une juridiction applicable, ou
          cesse de commercer ou menace de le faire.
        </Text>
        <Text style={styles.paragraph}>
          14.3 Sans préjudice de l’article 14.2, RewardzAi peut, en outre et sans responsabilité, résilier le présent
          contrat, ou bien suspendre l’accès et l’utilisation de tout Logiciel et/ou du Service, en donnant au Client un
          préavis écrit si :
        </Text>
        <Text style={styles.paragraph}>
          a) tout montant facturé (qui n’est pas contesté de bonne foi à l’époque) est impayé au-delà de la date
          d’échéance du paiement;
        </Text>
        <Text style={styles.paragraph}>b) toute disposition de l’article 5 est violée;</Text>
        <Text style={styles.paragraph}>
          c) toute disposition de l’article 10 est violée ou soupçonnée d’être violée; et/ou
        </Text>
        <Text style={styles.paragraph}>
          d) le Client est en violation persistante ou répétée de l’une quelconque de ses obligations au titre du
          présent contrat (qu’il s’agisse ou non de la même obligation qui est violée et que ces violations soient ou
          non corrigées).
        </Text>
        <Text style={styles.paragraph}>
          14.4 En ce qui concerne les suspensions en vertu de l’alinéa 13.3a), l’accès au Service sera rétabli
          rapidement après que RewardzAi aura reçu le paiement intégral et les fonds compensés.
        </Text>
        <Text style={styles.paragraph}>
          14.5 Les frais restent payables pendant toute période de suspension, même si le Client n’a pas accès au
          Logiciel et/ou au Service.
        </Text>
        <Text style={styles.paragraph}>
          14.6 Le Client convient que RewardzAi, à sa seule discrétion, a le droit (mais non l’obligation) de supprimer
          ou de désactiver le compte du Client, de bloquer le courriel ou l’adresse IP du Client, ou de résilier
          autrement l’accès ou l’utilisation du Logiciel et/ou du Service par le Client (ou toute partie de celui-ci),
          immédiatement et sans préavis, et supprimer et mettre au rebut les Données du Client, pour quelque raison que
          ce soit, y compris, sans s’y limiter, si RewardzAi estime que le Client a agi de manière incompatible avec le
          présent accord. De plus, le Client convient que RewardzAi ne sera pas responsable envers le Client ou tout
          tiers pour toute résiliation de cet accès au Logiciel et/ou au Service. Le Client s’engage à ne pas tenter
          d’utiliser le Logiciel ou le Service après résiliation.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>15. CONSÉQUENCES DE LA RÉSILIATION</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          15.1 Le Client reconnaît qu’en raison de la nature du Service, de la durée de la Période et de toute Période
          de renouvellement subséquente, il n’aura pas droit à un remboursement (en tout ou en partie) à l’égard du
          Service pour la Période et toute Période de renouvellement subséquente (sauf entente contraire).
        </Text>
        <Text style={styles.paragraph}>15.2 À la résiliation du présent Accord pour quelque raison que ce soit :</Text>
        <Text style={styles.paragraph}>
          a) le Client cessera immédiatement d’accéder au Logiciel et au Service et cessera toute utilisation de ceux-ci
          ;
        </Text>
        <Text style={styles.paragraph}>b) toutes les licences accordées en vertu du présent Accord prennent fin;</Text>
        <Text style={styles.paragraph}>
          c) tous les montants payables à RewardzAi par le Client deviennent immédiatement exigibles. Pour éviter toute
          ambiguïté, aucun remboursement des frais payés à l’avance ne sera dû à l’égard de toute partie non expirée de
          la période en cours; et
        </Text>
        <Text style={styles.paragraph}>
          d) RewardzAi peut détruire ou autrement éliminer les Données du Client en sa possession à la résiliation.
        </Text>
        <Text style={styles.paragraph}>
          15.3 Si le Client donne avis de la résiliation du présent contrat conformément à l’article 13, RewardzAi
          conservera les Données du Client pendant une période d’un mois (la « Période de réflexion »), après quoi il
          supprimera les Données du Client. Le Client peut choisir de renoncer à ce Délai de Réflexion et demander que
          ses données soient supprimées immédiatement à la résiliation s’il le souhaite.
        </Text>
        <Text style={styles.paragraph}>
          15.4 Si RewardzAi en fait la demande à tout moment par avis écrit au Client, le Client devra rapidement :
        </Text>
        <Text style={styles.paragraph}>
          a) détruire ou retourner à RewardzAi tous les documents et documents (et toute copie) contenant, reflétant,
          incorporant ou reposant sur les renseignements confidentiels de RewardzAi, y compris, sans s’y limiter, le
          Service;
        </Text>
        <Text style={styles.paragraph}>
          b) effacer toutes les informations confidentielles de ses systèmes et dispositifs informatiques et de
          communication qu’elle utilise (y compris ceux de toute société du groupe), ou qui sont stockées sous forme
          électronique;
        </Text>
        <Text style={styles.paragraph}>
          c) effacer toutes les informations confidentielles stockées sous forme électronique sur les systèmes et les
          services de stockage de données fournis par des tiers; et
        </Text>
        <Text style={styles.paragraph}>
          d) attester par écrit à RewardzAi qu’elle s’est conformée aux exigences du présent article 15.3.
        </Text>
        <Text style={styles.paragraph}>
          15.5 La résiliation du présent Accord pour quelque raison que ce soit n’aura aucune incidence sur :
        </Text>
        <Text style={styles.paragraph}>
          a) tout droit ou passif accumulé que l’une ou l’autre des parties peut avoir au moment où la résiliation prend
          effet; ou
        </Text>
        <Text style={styles.paragraph}>
          b) l’entrée en vigueur ou le maintien en vigueur de l’une ou l’autre de ses dispositions qui, expressément ou
          implicitement, sont destinées à entrer en vigueur ou à demeurer en vigueur à la résiliation ou après celle-ci.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>16. FORCE MAJEURE</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          Aucune des parties n’est responsable, en vertu du présent Accord, des retards ou des manquements à l’exécution
          du présent Accord qui découlent d’un événement hors du contrôle raisonnable de cette partie (« cas de force
          majeure »). La partie touchée par un tel événement en informe promptement l’autre partie par écrit lorsqu’un
          tel événement cause un retard ou un défaut d’exécution et lorsqu’il cesse de le faire. Si un tel événement se
          poursuit pendant une période continue de plus de 3 mois civils, l’une ou l’autre des parties peut résilier le
          présent accord par avis écrit à l’autre partie.
        </Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>17. GÉNÉRAL</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>
          17.1 RewardzAi se réserve le droit de modifier le Logiciel, le Service, tout contrat de licence d’utilisateur
          final et/ou la politique de confidentialité et d’imposer des conditions nouvelles ou supplémentaires au
          Client. Ces modifications et conditions supplémentaires seront communiquées au Client et, si elles sont
          acceptées, entreront en vigueur immédiatement et seront intégrées à la présente Convention. Dans le cas où le
          Client refuserait de telles modifications, RewardzAi aura le droit de résilier le présent contrat. Si RewardzAi
          est tenue d’apporter ces changements par la loi, ces changements s’appliqueront automatiquement à l’égard du
          présent Accord.
        </Text>
        <Text style={styles.paragraph}>
          17.2 Tous les avis et consentements relatifs à cette entente (mais excluant toute procédure ou autre document
          dans toute action en justice) doivent être écrits. envoyé à l’adresse du destinataire notifiée par la partie
          concernée conformément au présent accord. Les avis doivent être envoyés en main propre, par courrier
          recommandé ou par tout autre formulaire certifié, enregistré ou par courriel.
        </Text>
        <Text style={styles.paragraph}>
          17.3 À moins que les parties n’en conviennent expressément autrement par écrit, si une partie :
        </Text>
        <Text style={styles.paragraph}>
          a) omet d’exercer ou retarde l’exercice ou n’exerce que partiellement tout droit ou recours prévu par le
          présent accord ou par la loi; ou
        </Text>
        <Text style={styles.paragraph}>
          b) s’engage à ne pas exercer ou à retarder l’exercice de tout droit ou recours prévu par le présent accord ou
          par la loi;
        </Text>
        <Text style={styles.paragraph}>
          alors cette partie n’est pas réputée avoir renoncé et ne peut être empêchée ou restreinte d’exercer ce droit
          ou tout autre recours.
        </Text>
        <Text style={styles.paragraph}>
          17.4 Sauf disposition expresse du présent accord, les droits et recours prévus par le présent accord
          s’ajoutent aux droits ou recours prévus par la loi et ne sont pas exclusifs.
        </Text>
        <Text style={styles.paragraph}>
          17.5 Si une disposition ou une partie du présent Accord est jugée inefficace ou inapplicable pour quelque
          raison que ce soit, cela n’affectera pas la validité ou l’applicabilité de toute autre disposition du présent
          Accord ou du présent Accord. Si une disposition ou une partie du présent Accord est jugée inefficace ou
          inapplicable, mais qu’elle serait efficace ou exécutoire si une partie de la disposition était supprimée, la
          disposition en question s’appliquera avec ces modifications. qui peuvent être nécessaires pour le rendre
          exécutoire.
        </Text>
        <Text style={styles.paragraph}>
          17.6 Chaque partie confirme qu’elle agit pour son propre compte et non au profit d’une autre personne.
        </Text>
        <Text style={styles.paragraph}>
          17.7 Toutes les modifications à la présente entente doivent être convenues, énoncées par écrit et signées au
          nom des deux parties avant leur entrée en vigueur.
        </Text>
        <Text style={styles.paragraph}>
          17.8 Sauf dans la mesure où le présent accord prévoit expressément le contraire, rien dans le présent accord
          ne doit ou ne vise à créer une société de personnes ou une coentreprise entre les parties, constituer l’une
          des parties à titre de mandataire de l’autre ou donner à l’une ou l’autre des parties le pouvoir de prendre ou
          de conclure des engagements, d’assumer des responsabilités ou de donner du crédit en nantissement pour le
          compte de l’autre partie. Aucune des parties ne peut agir comme si elle était, ou représenter (expressément ou
          en l’impliquant) qu’elle est, un agent de l’autre ou a une telle autorité.
        </Text>
        <Text style={styles.paragraph}>
          17.9 Une personne qui n’est pas partie à la présente entente n’a aucun droit en vertu ou à l’égard de
          celle-ci, que ce soit en vertu des contrats ou autrement.
        </Text>
        <Text style={styles.paragraph}>
          17.10 Chaque partie reconnaît qu’en concluant la présente entente et les documents qui y sont mentionnés, elle
          ne se fonde sur aucune déclaration, déclaration, assurance ou garantie (qu’elle ait été faite de façon
          négligente ou innocente) de toute personne (qu’elle soit partie à la présente entente ou non). autres que ceux
          expressément énoncés dans la présente convention ou ces documents.
        </Text>
        <Text style={styles.paragraph}>
          17.11 Chaque partie convient que les seuls droits et recours dont elle dispose découlant d’une représentation
          ou en rapport avec celle-ci sont la rupture de contrat.
        </Text>
        <Text style={styles.paragraph}>
          17.12 La présente convention est régie par le droit français. Les deux parties se soumettent à la compétence
          exclusive des tribunaux de Paris en ce qui concerne tout litige découlant du présent accord ou de son objet.
          Toutefois, RewardzAi pourra également solliciter auprès de tout tribunal du monde entier une injonction ou
          d’autres recours pour protéger ou faire respecter ses droits de propriété intellectuelle.
        </Text>
      </View>
    </View>
  );
  const enContent = (
    <View>
      <Text style={styles.heading}>SUBSCRIPTION CONTRACT FOR THE RewardzAi SERVICE PUBLISHED BY RewardzAi SAS</Text>
      <View style={styles.subtitle}>
        <Text style={styles.paragraph}>1. DEFINITIONS AND INTERPRETATION</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.paragraph}>1.1 Definition</Text>
        <Text style={styles.paragraph}>
          The words and expressions in this Agreement (the “Agreement“) shall have the following meanings:
        </Text>
        <Text style={styles.paragraph}>
          Administrator: employees, staff, co-contractors of the Customer and any other person working with or on behalf
          of the Customer to access the services provided, which in each case the person concerned in accessing the
          Service does so exclusively on behalf of the Customer and with the Customer`s express permission;
        </Text>
        <Text style={styles.paragraph}>
          Customer: The Customer is the company that subscribes to the Service under this Agreement and extends to any
          declared subsidiary;
        </Text>
        <Text style={styles.paragraph}>
          Block Account: Third party account for the holding of funds by the Customer and Authorised Users in order to
          manage any transfer of value between them through the Platform;
        </Text>
        <Text style={styles.paragraph}>
          Effective Date: the date of subscription and receipt of payment by bank transfer credit card resulting in the
          transfer to the administrator of the login and password effectively giving access to the software. The
          Effective Date is confirmed to the Customer once access to the Platform has been granted;
        </Text>
        <Text style={styles.paragraph}>
          Customer Data: all data, information and inputs material or downloaded to a Software or transmitted through
          the Service by the Customer and/or any Authorised User;
        </Text>
        <Text style={styles.paragraph}>
          Intellectual property rights : patents, utility models, rights of invention, copyrights and related rights,
          trademarks and service marks, trade names and domain names, reproduction rights, goodwill and the right to sue
          for passing off or unfair competition, design rights, software rights, database rights, rights to maintain the
          confidentiality of information (including know-how and trade secrets) and all other intellectual property
          rights, including all applications for (and rights to apply for and obtain), renewals of or extensions of such
          rights and all similar or equivalent rights or forms of protection which subsist or will subsist, now or in
          the future, in any part of the world;
        </Text>
        <Text style={styles.paragraph}>
          Duration: the duration corresponds to the duration of the programme launched, any month started being due;
        </Text>
        <Text style={styles.paragraph}>
          Fees: The Customer has selected the amount of fees in relation to the Term as selected on the subscription
          page and charged;
        </Text>
        <Text style={styles.paragraph}>
          Software or Platform: any software owned or licensed by RewardzAi and forming part of the Service;
        </Text>
        <Text style={styles.paragraph}>
          Member: The member is the company that registers as a member of the RewardzAi community without subscribing to
          a service under this Agreement. An individual is not entitled to become a member if he/she is not acting on
          behalf of a company;
        </Text>
        <Text style={styles.paragraph}>
          Service: the Service to be provided by RewardzAi consisting of the provision of access to the Platform on a
          software basis (SaaS);
        </Text>
        <Text style={styles.paragraph}>
          Subscription: Full acceptance by the Client`s representative of the General Conditions applicable to the
          Contract
        </Text>
        <Text style={styles.paragraph}>
          Trusted third party: any third party company designated as accepted by RewardzAi carrying out the regulated
          activity;
        </Text>
        <Text style={styles.paragraph}>
          RewardzAi: the company RewardzAi SAS, located at 129 avenue Gabriel Peri 94170 Le Perreux sur Marne
        </Text>
        <Text style={styles.paragraph}>
          User or Authorised User: any natural person designated by the Customer as a user or potential user of the
          Platform;
        </Text>
        <Text style={styles.paragraph}>1.2 Interpretation</Text>
        <Text style={styles.paragraph}>
          Within this Agreement (including the introduction and annexes), unless the context otherwise requires :
        </Text>
        <Text style={styles.paragraph}>
          (a) the reference to a person includes a legal person (such as a limited liability company) as well as a
          natural person;
        </Text>
        <Text style={styles.paragraph}>
          (b) the headings of the Articles are for convenience only and shall not affect the interpretation of this
          Agreement;
        </Text>
        <Text style={styles.paragraph}>
          (c) references in this Agreement to “including“ or other similar terms shall be deemed to be by way of example
          and shall not limit the general applicability of the foregoing words;
        </Text>
        <Text style={styles.paragraph}>
          (d) any reference to legislation is to that legislation as amended, extended or re-enacted from time to time
          and to any subordinate provision made under that legislation; and
        </Text>
        <Text style={styles.paragraph}>e) words in the singular include the plural and vice versa.</Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>2. PURPOSE OF THE SERVICE</Text>
        </View>
        <Text style={styles.paragraph}>
          2.1 The purpose of the Service is to provide technical assistance to the Customer to create and manage
          loyalty, challenge and referral programs via the Platform. The Customer remains solely responsible for
          compliance with any applicable law in the Customer`s and Authorised Users` jurisdictions.
        </Text>
        <Text style={styles.paragraph}>
          2.2In order to access the Service, the Customer must provide and register information via the RewardzAi
          website. The Customer warrants that all information and statements submitted are complete, accurate and true.
        </Text>
        <Text style={styles.paragraph}>
          2.3 The Software enables the Customer to manage a Box Account opened by the Customer via the Platform in order
          to reward the Authorised User by means of a direct payment from the Customer to the Authorised User. The
          Client remains responsible for making the payment within the framework of the Software. RewardzAi is not
          responsible for any payment to the Client or the Authorised User.
        </Text>
        <Text style={styles.paragraph}>
          2.4 After the Effective Date and payment of the applicable Fees, RewardzAi will provide access to the Service
          for the Customer (including its Authorised Users) in respect of the Software it is authorised to access and
          use under this Agreement. The Service is either (i) “RewardzAi Standard“ which allows the use of the Platform
          for the Customer only and the Beneficiaries with standard technical support included, or (ii) Toooodooo
          Superadmin which allows multiple companies to access the use of the Platform under the administration of the
          Customer, an unlimited number of Authorised Users and technical support for integration.
        </Text>
        <Text style={styles.paragraph}>
          2.5It is the Customer`s responsibility to ensure that it has equipment (of an appropriate specification and
          compatible with the Software and Service) and an internet connection to enable the Customer to connect to the
          Service.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>3. MANAGEMENT OF THE PLATFORM</Text>
        </View>
        <Text style={styles.paragraph}>
          The Customer may create and manage loyalty, challenge and referral programs for its community members via the
          Platform. The Customer imports and manages all data, personal and non-personal, as data controller for the
          purposes of the programme provided by RewardzAi as data processor.
        </Text>
        <Text style={styles.paragraph}>
          The Client will set up a scenario and a number of credits awarded once the defined goal is reached. Once the
          setup is complete, the Customer`s commitment to its community is generated by the Platform and can be shared
          by the Customer with its community members.
        </Text>
        <Text style={styles.paragraph}>
          Credits can be converted into rewards subject to the conditions set by the Customer. Conversion can be set as
          discretionary at any time or at a specific predefined date.
        </Text>
        <Text style={styles.paragraph}>
          The rewards are triggered by the customer`s instruction by means of a Box Account instruction transmitted via
          the Platform to a Member of the customer`s community who holds a personal account with the same trust account
          operator.
        </Text>
        <Text style={styles.paragraph}>The Client shall ensure that his Pooled Account is funded.</Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>4.UPDATES AND AVAILABILITY</Text>
        </View>
        <Text style={styles.paragraph}>
          4.1The Customer acknowledges that from time to time RewardzAi may update the Software and/or the Service, and
          that such RewardzAi Updates may result in changes to the appearance and/or functionality of the Software and/or
          the Service.
        </Text>
        <Text style={styles.paragraph}>
          4.2Where applicable, and subject to clause 15, RewardzAi has a Service Availability Standard of 99.5% of the
          time (“Service Availability Standard“) excluding Force Majeure Events. In the event that RewardzAi does not
          comply with this Service Availability Standard, the Customer shall not be entitled to any refund of Fees.
        </Text>
        <Text style={styles.paragraph}>
          4.3 RewardzAi may provide support services for the Software and/or the Service through any channel of its
          choice without commitment to response times. If the Customer requires additional support services, it shall
          enter into a separate support agreement with RewardzAi.
        </Text>
        <Text style={styles.paragraph}>
          4. 4Subject to clause 4.3 and any service level agreement (“SLA“) to the extent that the parties have entered
          into such SLA. RewardzAi may issue changes to the Software and/or Service by means of a local patch of the
          Software and/or Service or other appropriate solution at the absolute discretion of RewardzAi. RewardzAi
          reserves the right to charge for any modification, new version and/or new release of the Software and/or the
          Service.
        </Text>
        <Text style={styles.paragraph}>
          4.5The Customer shall not be entitled to use any other company to maintain the Software and/or the Service.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>5. LICENSE AND SCOPE OF USE</Text>
        </View>
        <Text style={styles.paragraph}>
          5. 1Subject to payment in full of the applicable Fees, and in consideration of the parties` mutual obligations
          under this Agreement, the Customer is granted a non-transferable, non-exclusive, revocable and limited licence
          for the Term to access and use, and to permit Authorised Users to access and use, the Service for the Term.
        </Text>
        <Text style={styles.paragraph}>
          5.2Without prejudice to Articles 2.2 and 5.1, the Customer may only sub-license the right to access and/or use
          the Software or the Service to a third party under the conditions set out above in Section 2.3. The Customer
          is entitled to access and use the Software only in connection with the Service. Except as expressly provided
          in this Agreement, all rights in the Software and the Service (including the RewardzAi Content but excluding
          the Customer Data) are reserved to RewardzAi.
        </Text>
        <Text style={styles.paragraph}>5.3With regard to the scope of use :</Text>
        <Text style={styles.paragraph}>
          a) for the purposes of Article 5.1, use of the Software and/or the Service shall be limited to use of the
          Software in object code form for the Customer`s commercial or non-commercial purposes;
        </Text>
        <Text style={styles.paragraph}>
          (b) the Customer may not use the Software and/or the Service other than as specified in clause 4.3(a) without
          the prior written consent of RewardzAi, and the Customer acknowledges that additional fees may be payable on
          any change of use approved by RewardzAi; and
        </Text>
        <Text style={styles.paragraph}>5.4 The client shall :</Text>
        <Text style={styles.paragraph}>
          (a) comply with all applicable laws and regulations in respect of its activities under this Agreement;
        </Text>
        <Text style={styles.paragraph}>
          (b) obtain and maintain all necessary licenses, consents and authorizations for RewardzAi to perform its
          obligations under this Agreement;
        </Text>
        <Text style={styles.paragraph}>
          (c) maintain a complete and accurate record of the Customer`s disclosure of the Software, the Service and its
          Authorized Users, and produce such record to RewardzAi upon request from time to time;
        </Text>
        <Text style={styles.paragraph}>
          d) inform RewardzAi as soon as it becomes aware of any unauthorized use of the Software and/or the Service by
          any person;
        </Text>
        <Text style={styles.paragraph}>
          (e) pay, to extend the scope of the licences granted under this Agreement to cover unauthorised use by a third
          party, an amount equal to the fees that RewardzAi would have charged (in accordance with its then current
          normal commercial terms) had it authorised such unauthorised use on the date such use commenced together with
          interest at the rate set out in clause 5.6 from that date until the date of payment;
        </Text>
        <Text style={styles.paragraph}>
          f) not to copy, translate, modify, adapt or create derivative works of the Software and/or the Service;
        </Text>
        <Text style={styles.paragraph}>
          (g) not attempt to discover or access the source code of the Software or reverse engineer, modify, decrypt,
          extract, disassemble or decompile the Software (except strictly to the extent that the Customer is permitted
          to do so under applicable law in circumstances in which RewardzAi is not legally permitted to restrict or
          prevent the same), including for the purpose of :
        </Text>
        <Text style={styles.paragraph}>(i) create a competitive product or service;</Text>
        <Text style={styles.paragraph}>
          (ii)create a product using similar ideas, features, functions or graphics of the Software and/or Service; or
        </Text>
        <Text style={styles.paragraph}>
          (iii) copy the ideas, features, functions or graphics of the Software and/or the Software;
        </Text>
        <Text style={styles.paragraph}>
          (h) not attempt to interfere with the proper working of the Software and/or the Service and, in particular,
          not attempt to circumvent security, license control or other protection mechanisms, nor tamper with, hack into
          or otherwise disrupt the Software, the Service or any associated website, computer system, server, router or
          other device connected to the Internet;
        </Text>
        <Text style={styles.paragraph}>
          (i) not introduce viruses or other malicious software that may infect or damage the Software and/or the
          Service;
        </Text>
        <Text style={styles.paragraph}>
          (j) not obscure, alter or remove any copyright, trademark or other proprietary notices on the Software and/or
          the Service or during their use;
        </Text>
        <Text style={styles.paragraph}>
          k) not to resell the Software or Service to third parties or allow a third party to do so unless authorized by
          a reseller agreement between RewardzAi and the Customer;
        </Text>
        <Text style={styles.paragraph}>
          (l) not, and warrants that it shall not (either itself or through its Authorised Users), use or upload any
          personal data to the Service except with the express consent of the individuals concerned;
        </Text>
        <Text style={styles.paragraph}>m) not to use the Software and/or the Service:</Text>
        <Text style={styles.paragraph}>
          (i) upload, store, post, email, transmit or otherwise make available any content which infringes the
          intellectual property rights or data protection, privacy or other rights of any other person, is defamatory or
          in breach of any contractual duty or obligation of confidence, is obscene, sexually explicit, threatening,
          incites violence or hatred, is profane, discriminatory (on any grounds), knowingly false or misleading, or
          which does not comply with all applicable laws and regulations or which is otherwise objectionable or
          prohibited as set forth in any acceptable use policy published online via the Software, as updated by RewardzAi
          from time to time (“Prohibited Content“);
        </Text>
        <Text style={styles.paragraph}>
          (ii)impersonate any person or entity or misrepresent the customer`s relationship with any person or entity;
        </Text>
        <Text style={styles.paragraph}>
          (iii)engaging in any fraudulent activity or for any fraudulent purpose or providing material support or
          resources to any organisation designated as a foreign terrorist organisation;
        </Text>
        <Text style={styles.paragraph}>
          (iv) provide false identity information to access or use the Software and/or the Service; and/or
        </Text>
        <Text style={styles.paragraph}>
          (v) collect or store personal data about other users in connection with the prohibited activities and conduct
          described above.
        </Text>
        <Text style={styles.paragraph}>
          and does not permit any Authorised User or other third party to do any of the above.
        </Text>
        <Text style={styles.paragraph}>5.5The Client shall not :</Text>
        <Text style={styles.paragraph}>
          (a) assign or replace the benefit or burden of this Agreement in whole or in part;
        </Text>
        <Text style={styles.paragraph}>
          (b) allow the Software and/or the Service to be subject to any charge, lien or encumbrance; and
        </Text>
        <Text style={styles.paragraph}>(c) otherwise deal with its rights and obligations under this Agreement;</Text>
        <Text style={styles.paragraph}>without the prior written consent of RewardzAi.</Text>
        <Text style={styles.paragraph}>
          5.6 RewardzAi may at any time sub-licence, assign, novate, invoice or otherwise deal with any of its rights and
          obligations under this Agreement, provided that it gives written notice to the Client.
        </Text>
        <Text style={styles.paragraph}>
          5.7The Customer will comply with the Terms of Use, Acceptable Use Policy, Privacy Policy and/or Cookie Policy
          that RewardzAi may publish online via the Service, each as updated by RewardzAi from time to time, all of which
          are incorporated into this Agreement by reference.
        </Text>
        <Text style={styles.paragraph}>
          5.8 The Customer is responsible for the access and use of the Software and/or the Service by Authorised Users.
          The Customer shall ensure that all Authorised Users comply with the terms of this Agreement, including their
          obligation to comply with any other terms of use applicable to the Service and notified to the Customer. The
          Customer will only give access to the Service to Authorised Users through the access means provided by
          RewardzAi and will not give access to anyone other than an Authorised User. The Customer will immediately
          notify RewardzAi in case the Customer becomes aware of a breach of this agreement by an Authorised User.
        </Text>
        <Text style={styles.paragraph}>
          5.9 Customer is responsible for the security and confidentiality of all login credentials, including usernames
          and passwords, assigned or created by Customer or Authorized User for the purpose of Customer or its
          Authorized Users accessing or using the Software and/or Service (“ID“). The Customer acknowledges and agrees
          that it shall be solely responsible for all activities that occur under such ID. The Customer will promptly
          notify RewardzAi upon becoming aware of any unauthorized access or use of the Software and/or Service, and will
          provide all reasonable assistance to RewardzAi to terminate such unauthorized access or use.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>6. FEES, BILLING AND PAYMENT</Text>
        </View>
        <Text style={styles.paragraph}>
          6. 1Subject to clause 6.2, the Customer shall pay the Charges in advance for the Term of the Service every 6
          months or every year unless otherwise agreed in writing.
        </Text>
        <Text style={styles.paragraph}>
          6.2All sums due under this Agreement are exclusive of VAT or applicable local sales taxes, for which the
          Customer is responsible.
        </Text>
        <Text style={styles.paragraph}>
          6.3If the Customer fails to make any payment due to RewardzAi under this Agreement by the payment due date, the
          Customer shall reimburse RewardzAi for all reasonable costs incurred by RewardzAi in collecting late payments or
          interest, including attorney`s fees, court costs and collection costs; and if such default persists for
          fifteen (15) days after written notice thereof, RewardzAi may suspend performance of the Service until all past
          due amounts and interest thereon have been paid, without incurring any obligation or liability to the Customer
          or any other Person by reason of such suspension. In addition, RewardzAi may charge interest on the overdue
          amount at the rate of three times the legal interest rate for commercial transactions. In addition, pursuant
          to Articles L. 441-10 and D. 441-5 of the French Commercial Code, the Customer shall pay a flat fee of forty
          (40€) euros for collection costs per invoice, without prior notice, and without prejudice to any damages the
          Provider reserves the right to seek judicially; the Customer shall reimburse the Provider for all reasonable
          costs incurred by the Provider in collecting late payments or interest, including attorney`s fees, court costs
          and collection agency fees; and
        </Text>
        <Text style={styles.paragraph}>
          if such default continues for fifteen (15) days after written notice thereof, the Service Provider may suspend
          performance of the Service until all outstanding amounts and interest thereon have been paid, without
          incurring any obligation or liability to the Client or any other Person by reason of such suspension.
        </Text>
        <Text style={styles.paragraph}>
          6.4No Holdback or Set-off. All amounts payable to the Supplier under this Agreement shall be paid by the
          Customer to the Supplier in full without set-off, recovery, counterclaim, deduction, debit or withholding for
          any reason whatsoever and shall be the property of the Supplier and non-refundable.
        </Text>
        <Text style={styles.paragraph}>
          6.5The fees may be reviewed and increased by RewardzAi upon one calendar month`s notice, such increase to take
          effect the following calendar month, unless otherwise agreed.
        </Text>
        <Text style={styles.paragraph}>
          6. 6Fees may be paid by credit or debit card, or by any other method mutually agreed between the parties.
        </Text>
        <Text style={styles.paragraph}>
          6.7 Fees are payable, in full, without deduction, set-off or withholding of any kind. In the event of a
          dispute over the amount of an invoice, the Client shall pay the amount in full pending resolution of any
          dispute and RewardzAi shall make any adjustments due immediately upon such resolution.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>7. CONFIDENTIALITY AND PUBLICITY</Text>
        </View>
        <Text style={styles.paragraph}>
          7.1Each party shall, during the term of this Agreement and thereafter, keep all information confidential and
          shall not use it for its own purposes (except for the implementation of this Agreement) or without the prior
          written consent of the other party. Each party shall not disclose to the other party (other than to its
          professional advisors or any law or regulatory authority) any information of a confidential nature (including
          trade secrets and information of commercial value) that may become known to the other party and that relates
          to the other party or any of its affiliates, unless such information is publicly known or is already known to
          such party at the time of disclosure, or thereafter becomes publicly known other than by breach of this
          Agreement, or thereafter lawfully comes into the possession of such party by a third party. Each party shall
          use its best efforts to prevent unauthorised disclosure of such information.
        </Text>
        <Text style={styles.paragraph}>
          7. 2Subject to Articles 7.3 and 7.4, either Party shall be entitled to make, or permit anyone to make, a
          public announcement concerning this Agreement without the prior written consent of the other Parties, unless
          otherwise agreed.
        </Text>
        <Text style={styles.paragraph}>
          7.3 The Client shall display the “Powered by RewardzAi“ logo and/or the RewardzAi logo on its communications to
          Authorised Users.
        </Text>
        <Text style={styles.paragraph}>
          7.4 RewardzAi reserves the right to use descriptions and/or examples of the Customer`s use of the Software
          and/or the Service in its press releases, marketing channels and other advertising material. RewardzAi may also
          refer to and link to the Customer`s website.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>8. export</Text>
        </View>
        <Text style={styles.paragraph}>
          8. 1No party shall export, directly or indirectly, any technical data acquired from the other party under this
          Agreement (or any product, including software, incorporating such data) in violation of any applicable law or
          regulation, including the export laws and regulations of the United States, to any country for which the
          government or a government agency at the time of export requires an export license or other governmental
          approval, without first obtaining such license or approval.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>9 Intellectual property rights</Text>
        </View>
        <Text style={styles.paragraph}>
          9. 1 Nothing in this Agreement shall result in the ownership of intellectual property rights belonging to one
          party being transferred to the other.
        </Text>
        <Text style={styles.paragraph}>
          9.2 RewardzAi and/or its licensors shall, as between the parties, retain ownership of all Intellectual Property
          Rights in RewardzAi`s trademarks, brands and logos, the Software and the Service (including RewardzAi`s Content
          but excluding Customer Data). Except as expressly authorized in this Agreement, the Customer may not use any
          of RewardzAi`s Intellectual Property Rights without the prior written consent of RewardzAi.
        </Text>
        <Text style={styles.paragraph}>
          9.3 The Customer acknowledges that it may create Intellectual Property Rights by improving or suggesting
          improvements to the Software. All improvements to the Software or Service suggested by the Customer and
          developed by RewardzAi that result in the creation of Intellectual Property Rights belong to RewardzAi. The
          Customer hereby assigns to RewardzAi all intellectual property rights relating to the Software, the Service and
          waives its moral rights in this respect. The Customer shall sign and deliver the documents and perform the
          acts necessary to give full effect to this clause 9.3.
        </Text>
        <Text style={styles.paragraph}>
          9.4The Customer shall promptly bring to the attention of RewardzAi any improper or unjustified use of
          RewardzAi`s Intellectual Property Rights that comes to the Customer`s attention. The Customer shall assist
          RewardzAi in taking all necessary measures to defend its Intellectual Property Rights, but shall not take legal
          action on its own.
        </Text>
        <Text style={styles.paragraph}>
          9.5 The Customer and/or its licensors shall, as between the parties, retain ownership of all Intellectual
          Property Rights in the Customer Data. The Customer grants RewardzAi, free of charge, a worldwide, non-exclusive
          licence to use the Customer Data only to the extent necessary to enable RewardzAi to provide the Service and
          perform its obligations under this Agreement.
        </Text>
        <Text style={styles.paragraph}>
          9.6 The Customer warrants that the Customer has or has obtained a licence in respect of the Customer Data and
          is otherwise entitled to grant the licence in clause 8.6. If this agreement is terminated, the licence granted
          to RewardzAi in clause9.5 will automatically terminate.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>10. DATA PROTECTION</Text>
        </View>
        <Text style={styles.paragraph}>
          10.1 Within the framework of the performance of the Service, the Client may collect and process personal data
          via the Software.
        </Text>
        <Text style={styles.paragraph}>
          In this respect, it is agreed between the Parties that RewardzAi may be referred to as a Data Processor and the
          Client as a Data Controller within the meaning of Regulation (EU) 2016/679 of the European Parliament and of
          the Council of 27 April 2016 (“GDPR“). Both Parties shall comply with the mandatory rules and regulations
          relating to any applicable data privacy laws and regulations.
        </Text>
        <Text style={styles.paragraph}>
          Controller, processor, data subject, personal data, personal data breach, processing and appropriate technical
          and organisational measures as defined in the applicable data protection legislation.
        </Text>
        <Text style={styles.paragraph}>
          10.2 The parties acknowledge that when RewardzAi processes personal data, it does so on behalf of the Customer
          in the performance of its obligations under this Agreement. Therefore, the Customer is the data controller and
          RewardzAi is the data processor for the purposes of the applicable data protection law and regulations.
        </Text>
        <Text style={styles.paragraph}>
          RewardzAi processes Personal Data transferred to the Platform by the Client or an Authorised User in accordance
          with the Client`s instructions for a specific, explicit and legitimate purpose, to collect data fairly and
          lawfully, and to collect relevant, accurate and non-exhaustive data.
        </Text>
        <Text style={styles.paragraph}>
          RewardzAi will not collect and process personal data for any other purpose. The Customer remains at all times
          the sole Data Controller for the Customer Data
        </Text>
        <Text style={styles.paragraph}>
          10.3Without prejudice to the principle of clause 10.2, the Customer shall ensure that it has all appropriate
          consents and notices in place to allow the transfer of personal data to RewardzAi (or the collection of
          personal data by RewardzAi about the Customer) during the term and for the purposes of this Agreement, so that
          RewardzAi may lawfully use, process and transfer the personal data in accordance with this Agreement on behalf
          of the Customer.
        </Text>
        <Text style={styles.paragraph}>
          10.4Without prejudice to the generality of Article 9.2, RewardzAi shall, with respect to the personal data
          processed in the context of the performance by RewardzAi of its obligations under this Agreement :
        </Text>
        <Text style={styles.paragraph}>
          a) ensure that it has put in place appropriate technical and organisational measures, reviewed and approved by
          the Customer, to protect against unauthorised or unlawful processing of personal data and against accidental
          loss or destruction of, or damage to, personal data, appropriate to the harm that could result from the
          unauthorised or unlawful processing or accidental loss, destruction or damage and to the nature of the data to
          be protected taking into account the state of technological development and the cost of implementing any
          measures (such measures may include, where appropriate, pseudonymisation and encryption of personal data,
          ensuring the confidentiality, integrity, availability and resilience of its systems and services, ensuring
          that availability and access to personal data can be restored in a timely manner following an incident, and
          regularly evaluating the effectiveness of the technical and organisational measures adopted by it);
        </Text>
        <Text style={styles.paragraph}>
          b) Not to transfer personal data outside the European Economic Area unless the following conditions are met:
        </Text>
        <Text style={styles.paragraph}>
          (i) The Customer or RewardzAi has provided adequate safeguards with respect to the transfer;
        </Text>
        <Text style={styles.paragraph}>(ii) The data subject has enforceable rights and effective remedies;</Text>
        <Text style={styles.paragraph}>
          (iii) RewardzAi complies with its obligations under applicable data protection legislation by ensuring an
          adequate level of protection for all personal data that is transferred; and
        </Text>
        <Text style={styles.paragraph}>
          (iv) RewardzAi shall comply with reasonable instructions notified to it in advance by the Customer with regard
          to the processing of personal data;
        </Text>
        <Text style={styles.paragraph}>
          c) Assist the Customer, at the Customer`s expense, in responding to any request from a data subject and in
          ensuring compliance with its obligations under applicable data protection legislation with respect to
          security, breach notification, impact assessments and consultations with supervisory authorities or regulatory
          bodies;
        </Text>
        <Text style={styles.paragraph}>
          d) inform the Customer without undue delay as soon as it becomes aware of a personal data breach;
        </Text>
        <Text style={styles.paragraph}>
          (e) on written instruction from the Customer, delete or return personal data and copies thereof to the
          Customer on termination of the contract, unless required by applicable data protection legislation; and
        </Text>
        <Text style={styles.paragraph}>
          f) Maintain complete and accurate records and information to demonstrate compliance with this Article 10 and
          immediately inform the Customer if, in the opinion of RewardzAi, any instruction contravenes the applicable
          data protection legislation.
        </Text>
        <Text style={styles.paragraph}>
          10.8Each Party shall obtain and maintain all appropriate records required under data protection legislation to
          enable that Party to perform its obligations under this Agreement.
        </Text>
        <Text style={styles.paragraph}>
          10.9The Customer acknowledges and agrees that RewardzAi may use aggregated data derived from the Customer`s use
          of the Software and the Service hereunder, provided that RewardzAi has anonymized such data. RewardzAi may use
          for marketing and advertising purposes the total number of users, the total number of stored claim files, the
          total volume of transactions and other aggregated statistics to attract new customers.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>11. SUPPLIER`S GUARANTEES</Text>
        </View>
        <Text style={styles.paragraph}>11.1 RewardzAi guarantees that :</Text>
        <Text style={styles.paragraph}>
          (a) it has the right to enter into this Agreement and to provide the Service as provided for in this
          Agreement; and
        </Text>
        <Text style={styles.paragraph}>
          (b) the Software and Service shall, under normal operating conditions, substantially conform to the
          functionality described in the documentation on the RewardzAi website (which may be updated from time to time).
        </Text>
        <Text style={styles.paragraph}>
          11.2 If any of the warranties in clause 11.1 are breached, the Customer shall notify RewardzAi as soon as
          possible. The Customer shall allow RewardzAi a reasonable time to resolve the problem, including (at RewardzAi`s
          discretion) making available a corrected version of the Software and/or the Service (as the case may be) or a
          reasonable way around the problem that is not materially detrimental to the Customer and/or re-performing any
          relevant service. This will be done at no additional cost to the Customer. If RewardzAi is able to do so within
          a reasonable time, this shall be the Customer`s sole and exclusive remedy in respect of such breach and
          RewardzAi shall, subject to Section 12, have no further obligation or liability in respect of such breach.
        </Text>
        <Text style={styles.paragraph}>
          11.3 RewardzAi does not warrant that use of the Software and/or the Service will be uninterrupted or
          error-free.
        </Text>
        <Text style={styles.paragraph}>
          11.4 RewardzAi does not control the content published to or via the Service and, in particular, does not
          control or actively monitor the Customer Data and, as such, RewardzAi does not make any representations or
          warranties as to the accuracy, completeness, validity, correctness, reliability, integrity, usefulness,
          quality, fitness for purpose or originality of the aforementioned content or data. In the event of an alleged
          breach of Section 8, 9 or 10, RewardzAi shall have the right to remove the Customer Data from the Service
          without consulting the Customer.
        </Text>
        <Text style={styles.paragraph}>
          11.5The Customer accepts responsibility for the selection of the Software and Service to achieve the desired
          results and acknowledges that the Software and/or Service have not been developed to meet the individual
          requirements of the Customer.
        </Text>
        <Text style={styles.paragraph}>
          11.6All other conditions, warranties or other terms which may be effective between the parties or implied or
          incorporated into this Agreement or any Ancillary Agreement are hereby excluded, including any implied
          conditions, warranties or other terms as to satisfactory quality, fitness for purpose or use of reasonable
          skill and care.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>12. COMPENSATION FOR COUNTERFEITING</Text>
        </View>
        <Text style={styles.paragraph}>
          12.1The Customer shall indemnify RewardzAi and its affiliates against all liabilities, costs, expenses, damages
          or losses (including direct or indirect losses, loss of profit, loss of reputation and all interest, penalties
          and legal fees (calculated on a full indemnity basis) and all other professional fees and expenses) suffered
          or incurred by RewardzAi arising out of or in connection with:
        </Text>
        <Text style={styles.paragraph}>
          (a) any claim that the Customer Data infringes the intellectual property rights of a third party;
        </Text>
        <Text style={styles.paragraph}>
          b) any claim that Customer Data has been obtained without the express consent of the data subject and/or in
          breach of the Data Protection Legislation; or
        </Text>
        <Text style={styles.paragraph}>
          c) any third party claim arising from the use of the Software and/or the Service by the Customer or its
          Authorised User;
        </Text>
        <Text style={styles.paragraph}>each a “RewardzAi Claim“.</Text>
        <Text style={styles.paragraph}>
          12. 2Subject to Section 12, RewardzAi shall indemnify the Customer against all damages and legal costs finally
          awarded against the Customer by a court of competent jurisdiction and/or amounts paid by the Customer as a
          result of a final settlement approved by RewardzAi, as well as related legal costs reasonably incurred by the
          Customer, as a result of any claim by a third party that the Customer`s access to and use of the Software or
          Service, excluding Open-Source Software, pursuant to this Agreement infringes the Intellectual Property Rights
          of any third party (“Customer Claim“). This indemnity applies only to Customer Claims supported by a court
          judgment. It does not apply to alleged Customer Claims. For the avoidance of doubt, Section 11.2 does not
          apply where the Customer Claim in question is attributable to the Customer`s possession or use of the Software
          or Service (or any part thereof) other than in accordance with the terms of this Agreement, use of the
          Software and/or Service in combination with any hardware or software not provided or specified by RewardzAi if
          the infringement would have been avoided by the use of the Software or Services not in combination, or use of
          a non-current version of the Software or Service.
        </Text>
        <Text style={styles.paragraph}>
          12.3For the purposes of this clause 12.3, a RewardzAi Claim and a Customer Claim shall be deemed to be one
          “Claim“. If a third party makes a claim or gives notice of its intention to make a claim against a party, the
          indemnitor`s obligations are conditional on the indemnitee :
        </Text>
        <Text style={styles.paragraph}>
          (a) as soon as reasonably practicable, by giving written notice of the claim to the Indemnitee, stating the
          nature of the claim in sufficient detail;
        </Text>
        <Text style={styles.paragraph}>
          (b) not make any admission of liability, agreement or compromise in respect of the claim without the prior
          written consent of the indemnitor (such consent not to be unreasonably conditioned, withheld or delayed); and
        </Text>
        <Text style={styles.paragraph}>
          (c) give the Indemnitor and its professional advisers reasonable access (on reasonable notice) to the
          premises, officers, directors, employees, agents, representatives or advisers for the purpose of assessing the
          claim.
        </Text>
        <Text style={styles.paragraph}>
          12.4If a claim is made by the Customer, or in the reasonable opinion of RewardzAi, a claim is likely to be made
          against the Customer, RewardzAi may, at its sole option and expense:
        </Text>
        <Text style={styles.paragraph}>
          (a) provide the Customer with the right to continue to use the Software and/or the Service (or any part
          thereof) in accordance with the terms of this Agreement;
        </Text>
        <Text style={styles.paragraph}>b) modify the Software and/or Service so that it no longer infringes ;</Text>
        <Text style={styles.paragraph}>(c) replace the software and/or service with non-infringing software; or</Text>
        <Text style={styles.paragraph}>
          (d) immediately terminate this Agreement by written notice to the Customer and refund any Fees paid by the
          Customer as at the date of termination (less a reasonable sum in respect of the Customer`s use of the Software
          and/or the Service as at the date of termination),
        </Text>
        <Text style={styles.paragraph}>
          provided that if RewardzAi modifies or replaces the Software and/or Service, the modified or replacement
          Software and/or Service shall comply with the warranties in Section 10 and the Customer shall have the same
          rights in respect thereof as it would have had under those sections if the references to the date of this
          Agreement had been references to the date on which such modification or replacement was made
        </Text>
        <Text style={styles.paragraph}>
          12.5Notwithstanding any other provision of this Agreement, Section 12.2 shall not apply to the extent that any
          claim or action referred to in that Section arises directly or indirectly out of the possession or use of
          Third Party Software.
        </Text>
        <Text style={styles.paragraph}>
          12.6 Sections 12.2 to 12.4 constitute the Customer`s exclusive remedy and RewardzAi`s sole liability in respect
          of the Customer`s Claims and, for the avoidance of doubt, is subject to Section 13.1.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>13. LIMITS OF LIABILITY</Text>
        </View>
        <Text style={styles.paragraph}>13.1Except as expressly provided in paragraph 13.2 :</Text>
        <Text style={styles.paragraph}>
          RewardzAi can only be held liable for direct and foreseeable damage caused by a breach by the Supplier of its
          obligations under the Agreement.
        </Text>
        <Text style={styles.paragraph}>
          a) RewardzAi shall not be liable for any loss of profits; loss of revenue or profits; loss of customers; loss
          of opportunity; loss of image or reputation; loss of any cost associated with obtaining a substitute product,
          software, service or technology; or any technical difficulty in transmitting a message via the Internet.
        </Text>
        <Text style={styles.paragraph}>
          RewardzAi shall not be liable for any loss or damage resulting from the loss, corruption or destruction of
          files, information, transactions or data resulting from the Client`s use of one or more elements provided as
          part of the Service.
        </Text>
        <Text style={styles.paragraph}>
          The total cumulative liability of RewardzAi, for all damages for any reason whatsoever, cannot exceed the total
          amount of Taxes effectively collected during the six (6) months preceding the date of the incident giving rise
          to this liability.
        </Text>
        <Text style={styles.paragraph}>
          b) RewardzAi shall not be liable, whether in contract, tort (including negligence), breach of statutory duty,
          under indemnity or otherwise, for any loss, damage, expense or liability arising from:
        </Text>
        <Text style={styles.paragraph}>
          (i) the use of the Software and/or the Service, except for its normal intended use;
        </Text>
        <Text style={styles.paragraph}>
          (ii) any adaptation or modification of any Software and/or Service, or any integration or combination with any
          other equipment, software, product or material not provided by RewardzAi, in each case made by a person other
          than RewardzAi or without the express written consent of RewardzAi;
        </Text>
        <Text style={styles.paragraph}>
          (iii) any defect in the Software and/or the Service resulting from misuse, wilful damage, negligence on the
          part of any person other than RewardzAi, abnormal operating conditions or any failure by the Customer to follow
          RewardzAi`s instructions for its use;
        </Text>
        <Text style={styles.paragraph}>
          (iv) the compliance of RewardzAi with any design, specification or instructions provided by or on behalf of the
          Customer; or
        </Text>
        <Text style={styles.paragraph}>
          (v) the Customer or a third party (other than a subcontractor or representative of the Supplier) in respect of
          loss or damage to the Customer Data.
        </Text>
        <Text style={styles.paragraph}>
          13.2The exclusions in clause 13.1 apply to the fullest extent permitted by law, but RewardzAi does not exclude
          liability for:
        </Text>
        <Text style={styles.paragraph}>
          a) death or personal injury caused by the negligence of RewardzAi, its officers, employees, contractors or
          agents;
        </Text>
        <Text style={styles.paragraph}>(b) fraud or fraudulent misrepresentation;</Text>
        <Text style={styles.paragraph}>
          (c) pay the sums due to the Customer (if any) in the normal course of performance of this contract; or
        </Text>
        <Text style={styles.paragraph}>d) any other liability which cannot be excluded by law.</Text>
        <Text style={styles.paragraph}>
          13.3All references to “RewardzAi“ in this Article 13 only shall be deemed, for the purposes of this Article, to
          include all employees, subcontractors and suppliers of RewardzAi and its affiliates, all of whom shall benefit
          from the exclusions and limitations of liability set forth in this Article.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>14. DURATION AND TERMINATION</Text>
        </View>
        <Text style={styles.paragraph}>
          14.1 This Agreement shall commence on the Effective Date and, unless earlier terminated in accordance with its
          terms, shall continue for the Term and shall automatically renew thereafter for successive terms of equivalent
          duration (each a “Renewal Term“). unless and until either party gives at least 14 days` written notice to that
          effect (which notice shall expire at the end of the Term or any subsequent Renewal Term only).
        </Text>
        <Text style={styles.paragraph}>
          14.2 Either party may terminate this Agreement at any time by giving written notice to the other if:
        </Text>
        <Text style={styles.paragraph}>
          (a) the other is in material breach of any Article of this Agreement and it is not possible to remedy that
          breach;
        </Text>
        <Text style={styles.paragraph}>
          (b) the other party is in material breach of any term of this Agreement and it is possible to remedy that
          breach but the other party does not do so within 30 days of a written request to do so; or
        </Text>
        <Text style={styles.paragraph}>
          (c) the other party becomes insolvent, compounds with its creditors, causes a receiver or administrator to be
          appointed in respect of its business or all or a substantial part of its assets, or makes an order or passes
          an effective resolution for its administration, receivership, liquidation, winding up or other similar
          proceedings, or any other receivership, enforcement or sequestration proceedings in respect of all or a
          substantial part of its assets (which is not discharged, paid up, withdrawn or retired within 28 days);or is
          subject to proceedings equivalent or substantially similar to any such proceedings under any applicable
          jurisdiction, or ceases to trade or threatens to do so.
        </Text>
        <Text style={styles.paragraph}>
          14.3Without prejudice to Article 14.2, RewardzAi may, in addition and without liability, terminate this
          Agreement, or suspend access to and use of any Software and/or the Service, by giving the Customer prior
          written notice if :
        </Text>
        <Text style={styles.paragraph}>
          (a) any amount invoiced (which is not disputed in good faith at the time) is unpaid after the due date for
          payment;
        </Text>
        <Text style={styles.paragraph}>(b) any provision of Article 5 is violated;</Text>
        <Text style={styles.paragraph}>
          (c) any provision of Article 10 is violated or suspected of being violated; and/or
        </Text>
        <Text style={styles.paragraph}>
          (d) the Customer is in persistent or repeated breach of any of its obligations under this Agreement (whether
          or not the same obligation is breached and whether or not such breaches are cured).
        </Text>
        <Text style={styles.paragraph}>
          14.4With respect to suspensions under paragraph 13.3(a), access to the Service will be restored promptly after
          RewardzAi has received full payment and cleared funds.
        </Text>
        <Text style={styles.paragraph}>
          14.5The fees remain payable during any period of suspension, even if the Customer does not have access to the
          Software and/or the Service.
        </Text>
        <Text style={styles.paragraph}>
          14.6The Customer agrees that RewardzAi, in its sole discretion, has the right (but not the obligation) to
          delete or disable the Customer`s account, block the Customer`s email or IP address, or otherwise terminate the
          Customer`s access to or use of the Software and/or the Service (or any part thereof), immediately and without
          notice, and delete and discard the Customer Data, for any reason, including, without limitation, if RewardzAi
          believes that the Customer has acted inconsistently with this Agreement. Further, the Customer agrees that
          RewardzAi shall not be liable to the Customer or any third party for any termination of such access to the
          Software and/or the Service. The Customer agrees not to attempt to use the Software or Service after
          termination.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>15. CONSEQUENCES OF TERMINATION</Text>
        </View>
        <Text style={styles.paragraph}>
          15.1The Customer acknowledges that due to the nature of the Service, the length of the Term and any subsequent
          Renewal Term, the Customer will not be entitled to a refund (in whole or in part) in respect of the Service
          for the Term and any subsequent Renewal Term (unless otherwise agreed).
        </Text>
        <Text style={styles.paragraph}>15.2 Upon termination of this Agreement for any reason:</Text>
        <Text style={styles.paragraph}>
          (a) the Customer shall immediately cease to access and use the Software and Service;
        </Text>
        <Text style={styles.paragraph}>(b) all licences granted under this Agreement shall terminate;</Text>
        <Text style={styles.paragraph}>
          (c) all amounts payable to RewardzAi by the Customer become immediately due and payable. For the avoidance of
          doubt, no refund of fees paid in advance will be due in respect of any unexpired portion of the current
          period; and
        </Text>
        <Text style={styles.paragraph}>
          d) RewardzAi may destroy or otherwise dispose of the Customer Data in its possession upon termination.
        </Text>
        <Text style={styles.paragraph}>
          15.3If the Customer gives notice of termination of this Agreement in accordance with clause 13, RewardzAi will
          retain the Customer Data for a period of one month (the “Cooling Off Period“), after which it will delete the
          Customer Data. The Customer may choose to waive this Cooling Off Period and request that its data be deleted
          immediately upon termination if it so wishes.
        </Text>
        <Text style={styles.paragraph}>
          15.4If RewardzAi so requests at any time by written notice to the Customer, the Customer shall promptly :
        </Text>
        <Text style={styles.paragraph}>
          (a) destroy or return to RewardzAi all documents and materials (and any copies thereof) containing, reflecting,
          incorporating or relying on RewardzAi`s confidential information, including, without limitation, the Service
        </Text>
        <Text style={styles.paragraph}>
          (b) delete all confidential information from its computer and communication systems and devices (including
          those of any Group company), or which are stored in electronic form;
        </Text>
        <Text style={styles.paragraph}>
          (c) delete all confidential information stored electronically on data storage systems and services provided by
          third parties; and
        </Text>
        <Text style={styles.paragraph}>
          (d) certify in writing to RewardzAi that it has complied with the requirements of this clause 15.3.
        </Text>
        <Text style={styles.paragraph}>15.5 Termination of this Agreement for any reason shall not affect :</Text>
        <Text style={styles.paragraph}>
          (a) any accrued rights or liabilities that either party may have at the time the termination takes effect; or
        </Text>
        <Text style={styles.paragraph}>
          (b) the coming into force or continued operation of any of its provisions which, expressly or by implication,
          are intended to come into force or remain in force on or after termination.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>16. FORCE MAJEURE</Text>
        </View>
        <Text style={styles.paragraph}>
          Neither party shall be liable under this Agreement for any delay or failure to perform under this Agreement
          that results from an event beyond that party`s reasonable control (“Force Majeure“). The party affected by
          such an event shall promptly notify the other party in writing when such event causes a delay or failure in
          performance and when it ceases to do so. If such an event continues for a continuous period of more than 3
          calendar months, either party may terminate this Agreement by written notice to the other party.
        </Text>
        <View style={styles.subtitle}>
          <Text style={styles.paragraph}>17. GENERAL</Text>
        </View>
        <Text style={styles.paragraph}>
          17.1 RewardzAi reserves the right to modify the Software, the Service, any End User License Agreement and/or
          the Privacy Policy and to impose new or additional terms on the Customer. Such modifications and additional
          terms will be communicated to the Customer and, if accepted, will become effective immediately and be
          incorporated into this Agreement. In case the Customer does not accept such changes, RewardzAi shall have the
          right to terminate this Agreement. If RewardzAi is required to make such changes by law, such changes shall
          automatically apply with respect to this Agreement.
        </Text>
        <Text style={styles.paragraph}>
          17.2 All notices and consents in relation to this Agreement (but excluding any proceedings or other documents
          in any legal action) shall be in writing and shall be sent to the address of the addressee notified by the
          relevant party in accordance with this Agreement. Notices shall be sent by hand, by registered post or by any
          other certified form, recorded or by email.
        </Text>
        <Text style={styles.paragraph}>17. 3Unless the parties expressly agree otherwise in writing, if a party :</Text>
        <Text style={styles.paragraph}>
          (a) fails to exercise or delays the exercise of, or exercises only partially, any right or remedy provided by
          this Agreement or by law; or
        </Text>
        <Text style={styles.paragraph}>
          (b) undertakes not to exercise or delay the exercise of any right or remedy under this Agreement or by law;
        </Text>
        <Text style={styles.paragraph}>
          then that party shall not be deemed to have waived and shall not be prevented or restricted from exercising
          that or any other right.
        </Text>
        <Text style={styles.paragraph}>
          17.4Except as expressly provided in this Agreement, the rights and remedies provided in this Agreement are in
          addition to and not exclusive of any rights or remedies provided by law.
        </Text>
        <Text style={styles.paragraph}>
          17.5 If any provision or part of this Agreement is held to be ineffective or unenforceable for any reason, it
          shall not affect the validity or enforceability of any other provision of this Agreement or of this Agreement.
          If any provision or part of this Agreement is held to be ineffective or unenforceable, but would be effective
          or enforceable if any part of the provision were deleted, the provision in question shall apply with such
          modifications as may be necessary to make it enforceable.
        </Text>
        <Text style={styles.paragraph}>
          17.6Each party confirms that it is acting on its own behalf and not for the benefit of any other person.
        </Text>
        <Text style={styles.paragraph}>
          17.7All amendments to this Agreement must be agreed, set out in writing and signed on behalf of both parties
          before they come into effect.
        </Text>
        <Text style={styles.paragraph}>
          17.8Except to the extent that this Agreement expressly provides otherwise, nothing in this Agreement shall or
          is intended to create a partnership or joint venture between the Parties, constitute either Party as an agent
          of the other or give either Party authority to make or enter into commitments, assume liabilities or pledge
          credit on behalf of the other Party. Neither party may act as if it is, or represent (expressly or by
          implication) that it is, an agent of the other or has such authority.
        </Text>
        <Text style={styles.paragraph}>
          17.9A person who is not a party to this Agreement shall have no rights under or in respect of this Agreement,
          whether under the Contracts or otherwise.
        </Text>
        <Text style={styles.paragraph}>
          17.10Each party acknowledges that in entering into this Agreement and the documents referred to herein, it is
          not relying on any representation, statement, assurance or warranty (whether negligently or innocently made)
          of any person (whether a party to this Agreement or not). other than those expressly set out in this Agreement
          or such documents.
        </Text>
        <Text style={styles.paragraph}>
          17.11Each party agrees that the only rights and remedies available to it arising out of or in connection with
          a representation are for breach of contract.
        </Text>
        <Text style={styles.paragraph}>
          17. 12This agreement is governed by French law. Both parties submit to the exclusive jurisdiction of the
          courts of Paris with respect to any dispute arising out of this Agreement or its subject matter. However,
          RewardzAi may also seek injunctive or other relief from any court worldwide to protect or enforce its
          intellectual property rights.
        </Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {language === FR_VALUE ? frContent : enContent}
      </Page>
    </Document>
  );
};

export { StaticTCDocument };
