import { getSetting, localize, setSetting } from './module'

export function renderCombatTrackerConfig(config, html) {
    injectHTML(html)
    addEvents(html)
    html.css('height', 'auto')
}

function addEvents(html) {
    html.find('input[name="hideDeads"]').on('change', function () {
        const checked = $(this).is(':checked')
        setSetting('dead', checked)
    })
}

function injectHTML(html) {
    const checked = getSetting('dead') ? 'checked' : ''

    let content = '<div class="form-group">'
    content += `<label>${localize('settings.dead.name')}</label>`
    content += `<input type="checkbox" name="hideDeads" ${checked}>`
    content += `<p class="notes">${localize('settings.dead.hint')}</p>`
    content += '</div>'

    html.find('.form-group').last().after(content)
}
