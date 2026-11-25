import type { LocaleMessages } from '../locale/messages'
import { createCountFormatter } from '../overlay/format-count'

const number = createCountFormatter('fr')
const plural = new Intl.PluralRules('fr')
const nbsp = String.fromCodePoint(0xa0)
const isOne = (count: number): boolean => plural.select(count) === 'one'

const rejections = {
  count: 'trop de fichiers',
  size: 'fichier trop volumineux',
  type: 'type de fichier non accepté',
}

export const fr: LocaleMessages = {
  avatar: { away: 'Absent', busy: 'Occupé', offline: 'Hors ligne', online: 'En ligne' },
  avatarGroup: { overflow: (hidden) => `${number(hidden)} de plus` },
  breadcrumb: { breadcrumb: "Fil d'Ariane" },
  carousel: {
    dot: (index, count) => `Diapositive ${number(index + 1)} sur ${number(count)}`,
    dots: 'Choisir une diapositive',
    next: 'Diapositive suivante',
    pause: 'Mettre le diaporama en pause',
    play: 'Lancer le diaporama',
    previous: 'Diapositive précédente',
    roleDescription: 'carrousel',
    slide: (index, count) => `${number(index + 1)} sur ${number(count)}`,
    slideRoleDescription: 'diapositive',
  },
  chip: { remove: 'Retirer' },
  close: { label: 'Fermer' },
  colorPicker: {
    alpha: 'Opacité',
    area: 'Saturation et luminosité',
    areaValue: (saturation, brightness) =>
      `Saturation ${number(saturation)}${nbsp}%, luminosité ${number(brightness)}${nbsp}%`,
    blue: 'Bleu',
    colorPicker: 'Sélecteur de couleur',
    eyeDropper: "Prélever une couleur à l'écran",
    green: 'Vert',
    hex: 'Hexadécimal',
    hue: 'Teinte',
    lightness: 'Clarté',
    openColorPicker: 'Ouvrir le sélecteur de couleur',
    red: 'Rouge',
    saturation: 'Saturation',
    swatches: 'Nuancier',
  },
  commandPalette: {
    empty: 'Aucun résultat',
    label: 'Palette de commandes',
    placeholder: 'Saisissez une commande ou recherchez',
    results: (count) => `${number(count)} ${isOne(count) ? 'résultat' : 'résultats'}`,
  },
  confirm: { cancel: 'Annuler', confirm: 'Confirmer' },
  datePicker: {
    apply: 'Appliquer',
    calendar: 'Calendrier',
    cancel: 'Annuler',
    format: (format) => `Format${nbsp}: ${format}`,
    nextMonth: 'Mois suivant',
    nextYears: 'Années suivantes',
    openCalendar: 'Ouvrir le calendrier',
    previousMonth: 'Mois précédent',
    previousYears: 'Années précédentes',
  },
  fileUpload: {
    progress: (file) => `Envoi de ${file.name}`,
    prompt: 'Déposez des fichiers ici ou appuyez pour les choisir',
    rejection: ({ file, reason }) => `${file.name}${nbsp}: ${rejections[reason]}`,
    remove: (file) => `Retirer ${file.name}`,
  },
  input: { reveal: 'Afficher le mot de passe' },
  link: { external: "s'ouvre dans un nouvel onglet" },
  loader: { label: 'Chargement' },
  navbarToggle: { label: 'Afficher ou masquer la navigation' },
  numberInput: { decrement: 'Diminuer', increment: 'Augmenter' },
  paginator: {
    first: 'Première page',
    last: 'Dernière page',
    next: 'Page suivante',
    page: (page, current) => (current ? `Page ${page}, page actuelle` : `Page ${page}`),
    pageSize: 'Éléments par page',
    pagination: 'Pagination',
    previous: 'Page précédente',
    summary: (from, to, total) => `${number(from)}–${number(to)} sur ${number(total)}`,
  },
  pinInput: { input: (index, length) => `Caractère ${number(index)} sur ${number(length)}` },
  rating: {
    item: (value) => `${number(value)} ${isOne(value) ? 'étoile' : 'étoiles'}`,
    readOnly: (value, max) => `${number(value)} sur ${number(max)}`,
  },
  richTextEditor: {
    editor: 'Éditeur de texte enrichi',
    toolbar: 'Mise en forme',
    bold: 'Gras',
    italic: 'Italique',
    underline: 'Souligné',
    code: 'Code en ligne',
    link: 'Lien',
    linkAddress: 'Adresse du lien',
    applyLink: 'Appliquer',
    removeLink: 'Supprimer le lien',
    paragraph: 'Paragraphe',
    heading1: 'Titre 1',
    heading2: 'Titre 2',
    heading3: 'Titre 3',
    quote: 'Citation',
    codeBlock: 'Bloc de code',
    bullet: 'Liste à puces',
    ordered: 'Liste numérotée',
    font: 'Police',
    fontDefault: 'Police par défaut',
    fontSans: 'Sans empattement',
    fontSerif: 'Avec empattement',
    fontMono: 'Monospace',
    size: 'Taille de police',
    sizeDefault: 'Normale',
    sizeSmall: 'Petite',
    sizeLarge: 'Grande',
    sizeHuge: 'Très grande',
    alignStart: 'Aligner à gauche',
    alignCenter: 'Centrer',
    alignEnd: 'Aligner à droite',
    alignJustify: 'Justifier',
    undo: 'Annuler',
    redo: 'Rétablir',
  },
  select: {
    clear: 'Effacer',
    empty: 'Aucun résultat',
    overflow: (hidden) => `+${number(hidden)}`,
    remove: (label) => `Retirer ${label}`,
    search: 'Rechercher',
  },
  sidebarToggle: { label: 'Afficher ou masquer la barre latérale' },
  slider: { thumb: (index) => (index === 0 ? 'Minimum' : 'Maximum') },
  splitter: {
    resize: (handle, count) =>
      count === 1
        ? 'Redimensionner les panneaux'
        : `Redimensionner les panneaux ${number(handle)} sur ${number(count)}`,
  },
  stat: { down: 'Baisse', neutral: 'Aucun changement', up: 'Hausse' },
  stepper: { completed: 'Terminée', current: '', upcoming: 'Non commencée' },
  textarea: {
    count: (count, max) =>
      max === undefined ? number(count) : `${number(count)} / ${number(max)}`,
    remaining: (remaining) =>
      isOne(remaining)
        ? `${number(remaining)} caractère restant`
        : `${number(remaining)} caractères restants`,
  },
  timePicker: {
    am: 'AM',
    format: (format) => `Format${nbsp}: ${format}`,
    hours: 'Heures',
    minutes: 'Minutes',
    openTimePicker: "Ouvrir le sélecteur d'heure",
    period: 'Période',
    placeholder: (period) => (period ? `hh:mm ${period}` : 'hh:mm'),
    pm: 'PM',
    timePicker: "Sélecteur d'heure",
  },
  toast: { region: 'Notifications' },
  tour: {
    done: 'Terminer',
    next: 'Suivant',
    previous: 'Précédent',
    progress: (current, total) => `Étape ${number(current)} sur ${number(total)}`,
    skip: 'Passer',
  },
}
