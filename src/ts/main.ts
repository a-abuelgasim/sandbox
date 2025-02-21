import '../sass/style.scss';


const CLASSES = {
	PAPER: 'paper',
	SUBJECT_DIALOG_OPEN: 'dialog-open',
};

const DIALOG_ATTR_PREFIX = 'dialog';
const ATTRS = {
	DIALOG: DIALOG_ATTR_PREFIX,
	DIALOG_CLOSE_BTN: `${DIALOG_ATTR_PREFIX}-close-btn-for`,
	DIALOG_SHOW_BTN: `${DIALOG_ATTR_PREFIX}-show-btn-for`,
	DIALOG_SUBJECT: `${DIALOG_ATTR_PREFIX}-subject-for`,
	SUBJECT_DIALOG_OPEN: 'dialog-open',
};

document.addEventListener('DOMContentLoaded', () => {
	(document.querySelector(`[dialog="profile-dialog"]`)! as HTMLDialogElement).showModal();
	document.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		const dialogBtnClicked = target.closest(`[${ATTRS.DIALOG_SHOW_BTN}]`) as HTMLButtonElement;

		if (dialogBtnClicked) {
			const { dialogEl, subjectEl } = getDialogEls(dialogBtnClicked);
			dialogEl?.showModal();
			subjectEl?.classList.add(CLASSES.SUBJECT_DIALOG_OPEN);
			return;
		}

		const closeDialogBtnClicked = target.closest(`[${ATTRS.DIALOG_CLOSE_BTN}]`) as HTMLButtonElement;
		if (closeDialogBtnClicked) {
			const { dialogEl, subjectEl } = getDialogEls(closeDialogBtnClicked);
			dialogEl?.close();
			subjectEl?.classList.remove(CLASSES.SUBJECT_DIALOG_OPEN);
		}
	});
});


function getDialogEls(clickedDialogBtn: HTMLButtonElement): { dialogEl: HTMLDialogElement | null, subjectEl: HTMLElement | null } {
	const dialogID = clickedDialogBtn.getAttribute(ATTRS.DIALOG_SHOW_BTN) ??
		clickedDialogBtn.getAttribute(ATTRS.DIALOG_CLOSE_BTN);
	const dialogEl = document.querySelector(`[${ATTRS.DIALOG}=${dialogID}]`) as HTMLDialogElement;
	const subjectEl = document.querySelector(`[${ATTRS.DIALOG_SUBJECT}=${dialogID}]`) as HTMLElement;
	return { dialogEl, subjectEl };
}
