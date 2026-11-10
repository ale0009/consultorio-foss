// Catálogo local de software libre para el buscador de «¿Es APTO?».
// Semilla: el catálogo por dominio funcional que hicieron Mario y David para el
// Consultorio (marcado con `s: 1`); se completó con proyectos conocidos y cada
// repositorio se verificó en la API pública de GitHub el 2026-11-10 (nombre actual,
// licencia, actividad). Las líneas de «para qué sirve» son propias, en español.
// Campos: n nombre · cat categoría (CAT1…CAT11) · que para qué sirve (1 línea) ·
// lic licencia · repo «dueño/repo» en GitHub (null si no vive allí) · url sitio ·
// alias otros nombres · aviso algo que conviene saber antes de evaluarlo.
// Las funciones del final son puras y tienen pruebas en test/catalogo.test.js.

export const CATALOGO_FECHA = '2026-11-10';

export const CATALOGO = [
  // CAT1 · Ofimática y Productividad
  { n: 'LibreOffice', cat: 'CAT1', que: 'Suite de oficina: textos, hojas de cálculo, presentaciones y dibujo, con formato abierto ODF.', lic: 'MPL-2.0 (GitHub detecta GPL-3.0)', repo: 'LibreOffice/core', url: 'https://www.libreoffice.org', alias: ['libre office', 'office'] },
  { n: 'ONLYOFFICE Desktop Editors', cat: 'CAT1', que: 'Suite de oficina muy compatible con los formatos de Microsoft Office.', lic: 'AGPL-3.0', repo: 'ONLYOFFICE/DesktopEditors', url: 'https://www.onlyoffice.com', alias: ['onlyoffice'] },
  { n: 'CryptPad', cat: 'CAT1', que: 'Suite de oficina en el navegador con cifrado de extremo a extremo para editar en grupo.', lic: 'AGPL-3.0', repo: 'cryptpad/cryptpad', url: 'https://cryptpad.org' },
  { n: 'Joplin', cat: 'CAT1', que: 'Notas y listas de tareas en Markdown, sincronizadas entre equipos y con cifrado.', lic: 'AGPL-3.0', repo: 'laurent22/joplin', url: 'https://joplinapp.org' },
  { n: 'Logseq', cat: 'CAT1', que: 'Cuaderno de notas enlazadas para organizar conocimiento, local y privado.', lic: 'AGPL-3.0', repo: 'logseq/logseq', url: 'https://logseq.com' },
  { n: 'Calibre', cat: 'CAT1', que: 'Gestor de libros electrónicos: organiza, convierte formatos y edita e-books.', lic: 'GPL-3.0', repo: 'kovidgoyal/calibre', url: 'https://calibre-ebook.com' },
  { n: 'Stirling-PDF', cat: 'CAT1', que: 'Caja de herramientas para PDF en tu servidor: unir, dividir, OCR, firmar y convertir.', lic: 'MIT (con partes de pago)', repo: 'Stirling-Tools/Stirling-PDF', url: 'https://www.stirlingpdf.com', alias: ['pdf'] },
  { n: 'Zotero', cat: 'CAT1', que: 'Gestor de referencias bibliográficas: guarda fuentes y genera citas y bibliografías.', lic: 'AGPL-3.0', repo: 'zotero/zotero', url: 'https://www.zotero.org' },
  { n: 'Okular', cat: 'CAT1', que: 'Visor de documentos (PDF, e-books, imágenes) con anotaciones.', lic: 'GPL-2.0', repo: 'KDE/okular', url: 'https://okular.kde.org' },
  { n: 'Paperless-ngx', cat: 'CAT1', que: 'Archivo digital: escanea papeles, les aplica OCR y los deja buscables.', lic: 'GPL-3.0', repo: 'paperless-ngx/paperless-ngx', url: 'https://docs.paperless-ngx.com', alias: ['paperless'] },
  { n: 'Alfresco Community', cat: 'CAT1', que: 'Gestión documental empresarial: repositorio central, versiones y flujos de aprobación.', lic: 'LGPL-3.0', repo: 'Alfresco/alfresco-community-repo', url: 'https://www.alfresco.com', alias: ['alfresco'], s: 1 },
  { n: 'Mayan EDMS', cat: 'CAT1', que: 'Gestión documental: archivo, metadatos, OCR y flujos de trabajo de documentos.', lic: 'Apache-2.0', repo: 'mayan-edms/Mayan-EDMS', url: 'https://www.mayan-edms.com', alias: ['mayan'], aviso: 'El repositorio de GitHub es un espejo; el desarrollo vive en GitLab.', s: 1 },
  { n: 'MRBS', cat: 'CAT1', que: 'Reservas de salas y espacios (aulas, auditorios) desde el navegador.', lic: 'GPL-2.0', repo: null, url: 'https://mrbs.sourceforge.io', alias: ['meeting room booking system'], s: 1 },

  // CAT2 · Educativo y Formación
  { n: 'Moodle', cat: 'CAT2', que: 'Plataforma de aprendizaje (LMS) para crear cursos, tareas y evaluaciones en línea.', lic: 'GPL-3.0', repo: 'moodle/moodle', url: 'https://moodle.org' },
  { n: 'Chamilo', cat: 'CAT2', que: 'Plataforma de cursos virtuales (LMS) sencilla, muy usada en América Latina.', lic: 'GPL-3.0', repo: 'chamilo/chamilo-lms', url: 'https://chamilo.org' },
  { n: 'Open edX', cat: 'CAT2', que: 'Plataforma para cursos masivos en línea (MOOC), con estudio de autoría.', lic: 'AGPL-3.0', repo: 'openedx/openedx-platform', url: 'https://openedx.org', alias: ['edx'] },
  { n: 'Kolibri', cat: 'CAT2', que: 'Plataforma educativa que funciona sin internet, pensada para escuelas con poca conexión.', lic: 'MIT', repo: 'learningequality/kolibri', url: 'https://learningequality.org/kolibri' },
  { n: 'BigBlueButton', cat: 'CAT2', que: 'Aulas virtuales por videoconferencia con pizarra, encuestas y grabación.', lic: 'LGPL-3.0', repo: 'bigbluebutton/bigbluebutton', url: 'https://bigbluebutton.org' },
  { n: 'GCompris', cat: 'CAT2', que: 'Más de 100 actividades educativas para niños de 2 a 10 años.', lic: 'GPL-3.0', repo: 'KDE/gcompris', url: 'https://gcompris.net' },
  { n: 'Anki', cat: 'CAT2', que: 'Tarjetas de memoria con repetición espaciada para estudiar y memorizar.', lic: 'AGPL-3.0', repo: 'ankitects/anki', url: 'https://apps.ankiweb.net' },
  { n: 'Scratch', cat: 'CAT2', que: 'Programación con bloques para aprender a crear juegos e historias interactivas.', lic: 'AGPL-3.0', repo: 'scratchfoundation/scratch-editor', url: 'https://scratch.mit.edu' },
  { n: 'Stellarium', cat: 'CAT2', que: 'Planetario en el computador: muestra el cielo real en 3D para enseñar astronomía.', lic: 'GPL-2.0', repo: 'Stellarium/stellarium', url: 'https://stellarium.org' },

  // CAT3 · Seguridad y Datos Críticos
  { n: 'KeePassXC', cat: 'CAT3', que: 'Gestor de contraseñas local y cifrado, sin depender de la nube.', lic: 'GPL-3.0', repo: 'keepassxreboot/keepassxc', url: 'https://keepassxc.org', alias: ['keepass'] },
  { n: 'Bitwarden', cat: 'CAT3', que: 'Gestor de contraseñas para equipos, con servidor propio opcional.', lic: 'AGPL-3.0 y Bitwarden License', repo: 'bitwarden/server', url: 'https://bitwarden.com', aviso: 'Parte del código usa una licencia propia que no es libre: revisa qué módulos necesitas.' },
  { n: 'Vaultwarden', cat: 'CAT3', que: 'Servidor ligero compatible con los clientes de Bitwarden, para alojarlo uno mismo.', lic: 'AGPL-3.0', repo: 'dani-garcia/vaultwarden', url: 'https://github.com/dani-garcia/vaultwarden' },
  { n: 'VeraCrypt', cat: 'CAT3', que: 'Cifrado de discos y particiones completos para proteger datos en reposo.', lic: 'Apache-2.0 y TrueCrypt License', repo: 'veracrypt/VeraCrypt', url: 'https://veracrypt.io', aviso: 'Hereda código bajo la licencia de TrueCrypt, que la FSF no considera libre.' },
  { n: 'Wazuh', cat: 'CAT3', que: 'Plataforma de seguridad (SIEM/XDR): detecta amenazas, vigila integridad y cumplimiento.', lic: 'GPL-2.0 y AGPL-3.0', repo: 'wazuh/wazuh', url: 'https://wazuh.com' },
  { n: 'Suricata', cat: 'CAT3', que: 'Detección y prevención de intrusos en la red (IDS/IPS).', lic: 'GPL-2.0', repo: 'OISF/suricata', url: 'https://suricata.io', s: 1 },
  { n: 'Snort', cat: 'CAT3', que: 'Detección de intrusos en la red por reglas (IDS/IPS).', lic: 'GPL-2.0', repo: 'snort3/snort3', url: 'https://www.snort.org', alias: ['snort3'] },
  { n: 'OPNsense', cat: 'CAT3', que: 'Cortafuegos y router con interfaz web: VPN, filtrado y detección de intrusos.', lic: 'BSD-2-Clause', repo: 'opnsense/core', url: 'https://opnsense.org', s: 1 },
  { n: 'pfSense CE', cat: 'CAT3', que: 'Cortafuegos y router basado en FreeBSD, administrable desde el navegador.', lic: 'Apache-2.0', repo: 'pfsense/pfsense', url: 'https://www.pfsense.org', alias: ['pfsense'], s: 1 },
  { n: 'OpenVPN', cat: 'CAT3', que: 'Red privada virtual (VPN) para conectarse de forma segura a la red de la organización.', lic: 'GPL-2.0', repo: 'OpenVPN/openvpn', url: 'https://openvpn.net', alias: ['vpn'], s: 1 },
  { n: 'Keycloak', cat: 'CAT3', que: 'Inicio de sesión único (SSO) y gestión de identidades para aplicaciones.', lic: 'Apache-2.0', repo: 'keycloak/keycloak', url: 'https://www.keycloak.org', alias: ['sso'], s: 1 },
  { n: 'authentik', cat: 'CAT3', que: 'Proveedor de identidad: SSO, doble factor y control de acceso para tus servicios.', lic: 'MIT (con partes de pago)', repo: 'goauthentik/authentik', url: 'https://goauthentik.io' },
  { n: 'FreeIPA', cat: 'CAT3', que: 'Gestión centralizada de identidades, políticas y autenticación en redes Linux.', lic: 'GPL-3.0', repo: 'freeipa/freeipa', url: 'https://www.freeipa.org', s: 1 },
  { n: 'OpenLDAP', cat: 'CAT3', que: 'Directorio LDAP centralizado de usuarios y grupos.', lic: 'OpenLDAP Public License', repo: 'openldap/openldap', url: 'https://www.openldap.org', alias: ['ldap'], s: 1 },
  { n: 'Bacula', cat: 'CAT3', que: 'Copias de seguridad en red para muchos equipos, con recuperación ante desastres.', lic: 'AGPL-3.0', repo: null, url: 'https://www.bacula.org', s: 1 },
  { n: 'Bareos', cat: 'CAT3', que: 'Copias de seguridad en red (derivado de Bacula), con interfaz web.', lic: 'AGPL-3.0', repo: 'bareos/bareos', url: 'https://www.bareos.com', s: 1 },
  { n: 'restic', cat: 'CAT3', que: 'Copias de seguridad rápidas, cifradas y con deduplicación, desde la terminal.', lic: 'BSD-2-Clause', repo: 'restic/restic', url: 'https://restic.net' },
  { n: 'BorgBackup', cat: 'CAT3', que: 'Copias de seguridad con deduplicación, compresión y cifrado.', lic: 'BSD-3-Clause', repo: 'borgbackup/borg', url: 'https://www.borgbackup.org', alias: ['borg'] },
  { n: 'ClamAV', cat: 'CAT3', que: 'Antivirus para servidores de correo y archivos.', lic: 'GPL-2.0', repo: 'Cisco-Talos/clamav', url: 'https://www.clamav.net', alias: ['antivirus'] },
  { n: 'ZAP', cat: 'CAT3', que: 'Escáner de seguridad para aplicaciones web (pruebas de penetración).', lic: 'Apache-2.0', repo: 'zaproxy/zaproxy', url: 'https://www.zaproxy.org', alias: ['owasp zap', 'zaproxy'] },
  { n: 'Wireshark', cat: 'CAT3', que: 'Analizador de tráfico de red para diagnosticar e investigar incidentes.', lic: 'GPL-2.0', repo: 'wireshark/wireshark', url: 'https://www.wireshark.org' },

  // CAT4 · Infraestructura y Servidores
  { n: 'Proxmox VE', cat: 'CAT4', que: 'Virtualización de servidores: máquinas virtuales y contenedores desde una web.', lic: 'AGPL-3.0', repo: 'proxmox/pve-manager', url: 'https://www.proxmox.com', alias: ['proxmox'], s: 1 },
  { n: 'Docker Engine (Moby)', cat: 'CAT4', que: 'Ejecuta aplicaciones en contenedores aislados y fáciles de mover.', lic: 'Apache-2.0', repo: 'moby/moby', url: 'https://mobyproject.org', alias: ['docker', 'moby'], s: 1 },
  { n: 'Kubernetes', cat: 'CAT4', que: 'Orquesta contenedores en varios servidores: despliegue, escalado y recuperación.', lic: 'Apache-2.0', repo: 'kubernetes/kubernetes', url: 'https://kubernetes.io', alias: ['k8s'] },
  { n: 'Debian', cat: 'CAT4', que: 'Sistema operativo GNU/Linux estable, muy usado en servidores.', lic: 'Varias licencias libres (DFSG)', repo: null, url: 'https://www.debian.org', alias: ['linux'], s: 1 },
  { n: 'CentOS Stream', cat: 'CAT4', que: 'Sistema operativo Linux para servidores, de la familia Red Hat.', lic: 'Varias licencias libres', repo: null, url: 'https://www.centos.org', alias: ['centos'], aviso: 'CentOS Linux terminó en 2024; hoy solo existe CentOS Stream. Rocky Linux y AlmaLinux son las alternativas estables.', s: 1 },
  { n: 'Ansible', cat: 'CAT4', que: 'Automatiza la configuración y el despliegue de servidores con recetas en YAML.', lic: 'GPL-3.0', repo: 'ansible/ansible', url: 'https://www.ansible.com', s: 1 },
  { n: 'Puppet', cat: 'CAT4', que: 'Gestión de configuración: mantiene muchos servidores en el estado deseado.', lic: 'Apache-2.0', repo: 'puppetlabs/puppet', url: 'https://www.puppet.com', s: 1 },
  { n: 'OpenTofu', cat: 'CAT4', que: 'Infraestructura como código: describe servidores y nube en archivos y los crea solos.', lic: 'MPL-2.0', repo: 'opentofu/opentofu', url: 'https://opentofu.org', alias: ['terraform'] },
  { n: 'Zabbix', cat: 'CAT4', que: 'Monitoreo de servidores, redes y servicios con alertas.', lic: 'AGPL-3.0', repo: 'zabbix/zabbix', url: 'https://www.zabbix.com', s: 1 },
  { n: 'Nagios Core', cat: 'CAT4', que: 'Monitoreo clásico de equipos y servicios con alertas ante fallos.', lic: 'GPL-2.0', repo: 'NagiosEnterprises/nagioscore', url: 'https://www.nagios.org', alias: ['nagios'], s: 1 },
  { n: 'Prometheus', cat: 'CAT4', que: 'Recoge métricas de sistemas y servicios y lanza alertas.', lic: 'Apache-2.0', repo: 'prometheus/prometheus', url: 'https://prometheus.io', s: 1 },
  { n: 'Grafana', cat: 'CAT4', que: 'Tableros para visualizar métricas, registros y alertas de muchas fuentes.', lic: 'AGPL-3.0', repo: 'grafana/grafana', url: 'https://grafana.com', s: 1 },
  { n: 'Graylog', cat: 'CAT4', que: 'Centraliza y analiza los registros (logs) de servidores y aplicaciones.', lic: 'SSPL-1.0', repo: 'Graylog2/graylog2-server', url: 'https://graylog.org', aviso: 'Desde la versión 4 usa SSPL, que la OSI no aprueba como licencia libre. Alternativa: OpenSearch.', s: 1 },
  { n: 'Uptime Kuma', cat: 'CAT4', que: 'Vigila si tus sitios y servicios están en línea y avisa cuando caen.', lic: 'MIT', repo: 'louislam/uptime-kuma', url: 'https://uptime.kuma.pet' },
  { n: 'TrueNAS', cat: 'CAT4', que: 'Almacenamiento en red (NAS) con ZFS, instantáneas y réplicas.', lic: 'LGPL-3.0 y otras', repo: 'truenas/middleware', url: 'https://www.truenas.com', alias: ['freenas'], s: 1 },
  { n: 'Ceph', cat: 'CAT4', que: 'Almacenamiento distribuido de objetos, bloques y archivos para centros de datos.', lic: 'LGPL-2.1 y LGPL-3.0', repo: 'ceph/ceph', url: 'https://ceph.io', s: 1 },
  { n: 'NGINX', cat: 'CAT4', que: 'Servidor web y proxy inverso de alto rendimiento.', lic: 'BSD-2-Clause', repo: 'nginx/nginx', url: 'https://nginx.org' },
  { n: 'Apache HTTP Server', cat: 'CAT4', que: 'Servidor web veterano y muy extendido.', lic: 'Apache-2.0', repo: 'apache/httpd', url: 'https://httpd.apache.org', alias: ['apache', 'httpd'] },
  { n: 'Traefik', cat: 'CAT4', que: 'Proxy inverso que configura solo las rutas hacia tus contenedores.', lic: 'MIT', repo: 'traefik/traefik', url: 'https://traefik.io' },
  { n: 'BIND 9', cat: 'CAT4', que: 'Servidor DNS: traduce nombres de dominio a direcciones IP.', lic: 'MPL-2.0', repo: null, url: 'https://www.isc.org/bind/', alias: ['bind', 'dns', 'isc dhcp'], aviso: 'Su compañero ISC DHCP dejó de mantenerse en 2022; el reemplazo de ISC es Kea.', s: 1 },
  { n: 'FreeRADIUS', cat: 'CAT4', que: 'Autenticación y control de acceso a la red (RADIUS) para Wi-Fi y VPN.', lic: 'GPL-2.0', repo: 'FreeRADIUS/freeradius-server', url: 'https://freeradius.org', alias: ['radius'], s: 1 },
  { n: 'Asterisk', cat: 'CAT4', que: 'Central telefónica IP (PBX): extensiones, buzón de voz y colas de llamadas.', lic: 'GPL-2.0', repo: 'asterisk/asterisk', url: 'https://www.asterisk.org', alias: ['pbx', 'voip'], s: 1 },
  { n: 'Issabel', cat: 'CAT4', que: 'Comunicaciones unificadas sobre Asterisk, con interfaz web en español.', lic: 'GPL-3.0', repo: 'IssabelFoundation/issabelPBX', url: 'https://www.issabel.org', s: 1 },
  { n: 'GLPI', cat: 'CAT4', que: 'Inventario de equipos TI y mesa de ayuda con tickets.', lic: 'GPL-3.0', repo: 'glpi-project/glpi', url: 'https://glpi-project.org', s: 1 },
  { n: 'Snipe-IT', cat: 'CAT4', que: 'Control de activos TI y licencias: quién tiene qué equipo.', lic: 'AGPL-3.0', repo: 'grokability/snipe-it', url: 'https://snipeitapp.com', alias: ['snipe it'], s: 1 },
  { n: 'OCS Inventory NG', cat: 'CAT4', que: 'Inventario automático del hardware y software de los equipos de la red.', lic: 'GPL-2.0', repo: 'OCSInventory-NG/OCSInventory-ocsreports', url: 'https://ocsinventory-ng.org', alias: ['ocs inventory', 'ocs'], s: 1 },

  // CAT5 · Desarrollo y Gestión de Proyectos
  { n: 'Git', cat: 'CAT5', que: 'Control de versiones: guarda la historia de cada cambio del código.', lic: 'GPL-2.0', repo: 'git/git', url: 'https://git-scm.com' },
  { n: 'GitLab CE', cat: 'CAT5', que: 'Plataforma completa para alojar código, revisarlo y automatizar pruebas (CI/CD).', lic: 'MIT', repo: 'gitlabhq/gitlabhq', url: 'https://about.gitlab.com', alias: ['gitlab'] },
  { n: 'Gitea', cat: 'CAT5', que: 'Servidor Git liviano para alojar repositorios propios, con incidencias y CI.', lic: 'MIT', repo: 'go-gitea/gitea', url: 'https://about.gitea.com' },
  { n: 'Visual Studio Code', cat: 'CAT5', que: 'Editor de código con extensiones (el código fuente es MIT).', lic: 'MIT (el binario de Microsoft no)', repo: 'microsoft/vscode', url: 'https://code.visualstudio.com', alias: ['vscode', 'vs code'], aviso: 'La descarga oficial de Microsoft lleva licencia propietaria y telemetría; VSCodium es la versión libre.' },
  { n: 'VSCodium', cat: 'CAT5', que: 'Versión de VS Code compilada sin telemetría ni licencia de Microsoft.', lic: 'MIT', repo: 'VSCodium/vscodium', url: 'https://vscodium.com' },
  { n: 'Jenkins', cat: 'CAT5', que: 'Servidor de automatización: compila, prueba y despliega en cada cambio.', lic: 'MIT', repo: 'jenkinsci/jenkins', url: 'https://www.jenkins.io' },
  { n: 'Redmine', cat: 'CAT5', que: 'Gestión de proyectos con incidencias, diagramas de Gantt y wiki.', lic: 'GPL-2.0', repo: 'redmine/redmine', url: 'https://www.redmine.org' },
  { n: 'OpenProject', cat: 'CAT5', que: 'Gestión de proyectos: planificación, Gantt, ágil y control de tiempos.', lic: 'GPL-3.0', repo: 'opf/openproject', url: 'https://www.openproject.org' },
  { n: 'Taiga', cat: 'CAT5', que: 'Gestión ágil de proyectos con Scrum y Kanban.', lic: 'MPL-2.0', repo: 'taigaio/taiga-back', url: 'https://taiga.io' },
  { n: 'Plane', cat: 'CAT5', que: 'Seguimiento de tareas y proyectos, alternativa libre a Jira.', lic: 'AGPL-3.0', repo: 'makeplane/plane', url: 'https://plane.so' },
  { n: 'Wekan', cat: 'CAT5', que: 'Tableros Kanban colaborativos, parecido a Trello.', lic: 'MIT', repo: 'wekan/wekan', url: 'https://wekan.github.io', alias: ['trello'] },
  { n: 'Kanboard', cat: 'CAT5', que: 'Tablero Kanban minimalista para gestionar tareas.', lic: 'MIT', repo: 'kanboard/kanboard', url: 'https://kanboard.org' },

  // CAT6 · Comunicación y Colaboración
  { n: 'Nextcloud', cat: 'CAT6', que: 'Nube propia: archivos compartidos, calendario, contactos y videollamadas.', lic: 'AGPL-3.0', repo: 'nextcloud/server', url: 'https://nextcloud.com', alias: ['owncloud'], s: 1 },
  { n: 'Mattermost', cat: 'CAT6', que: 'Chat de equipo alojado por la organización, parecido a Slack.', lic: 'AGPL-3.0 y MIT (con partes de pago)', repo: 'mattermost/mattermost', url: 'https://mattermost.com', alias: ['slack'], s: 1 },
  { n: 'Rocket.Chat', cat: 'CAT6', que: 'Mensajería de equipo y atención al cliente, alojable en servidor propio.', lic: 'MIT (con partes de pago)', repo: 'RocketChat/Rocket.Chat', url: 'https://www.rocket.chat', alias: ['rocketchat'], s: 1 },
  { n: 'Zulip', cat: 'CAT6', que: 'Chat de equipo organizado por temas para conversaciones ordenadas.', lic: 'Apache-2.0', repo: 'zulip/zulip', url: 'https://zulip.com' },
  { n: 'Element', cat: 'CAT6', que: 'Mensajería cifrada sobre el protocolo abierto Matrix.', lic: 'AGPL-3.0', repo: 'element-hq/element-web', url: 'https://element.io', alias: ['matrix'] },
  { n: 'Jitsi Meet', cat: 'CAT6', que: 'Videollamadas en el navegador sin cuenta, alojables en servidor propio.', lic: 'Apache-2.0', repo: 'jitsi/jitsi-meet', url: 'https://jitsi.org', alias: ['jitsi', 'zoom'] },
  { n: 'Signal', cat: 'CAT6', que: 'Mensajería privada con cifrado de extremo a extremo.', lic: 'AGPL-3.0', repo: 'signalapp/Signal-Desktop', url: 'https://signal.org' },
  { n: 'XWiki', cat: 'CAT6', que: 'Wiki empresarial para intranet y base de conocimiento.', lic: 'LGPL-2.1', repo: 'xwiki/xwiki-platform', url: 'https://www.xwiki.org', s: 1 },
  { n: 'BookStack', cat: 'CAT6', que: 'Wiki ordenada como libros y capítulos para la documentación interna.', lic: 'MIT', repo: 'BookStackApp/BookStack', url: 'https://www.bookstackapp.com' },
  { n: 'Wiki.js', cat: 'CAT6', que: 'Wiki moderna en Markdown con buscador y permisos.', lic: 'AGPL-3.0', repo: 'requarks/wiki', url: 'https://js.wiki', alias: ['wikijs'] },
  { n: 'WordPress', cat: 'CAT6', que: 'Gestor de contenidos para sitios web, blogs e intranets.', lic: 'GPL-2.0', repo: 'WordPress/WordPress', url: 'https://wordpress.org', alias: ['cms'], s: 1 },
  { n: 'Discourse', cat: 'CAT6', que: 'Foros de discusión modernos para comunidades y equipos.', lic: 'GPL-2.0', repo: 'discourse/discourse', url: 'https://www.discourse.org' },
  { n: 'Roundcube', cat: 'CAT6', que: 'Correo web: lee y envía correo desde el navegador.', lic: 'GPL-3.0', repo: 'roundcube/roundcubemail', url: 'https://roundcube.net', alias: ['webmail'] },
  { n: 'Thunderbird', cat: 'CAT6', que: 'Cliente de correo, calendario y contactos para el escritorio.', lic: 'MPL-2.0', repo: null, url: 'https://www.thunderbird.net', alias: ['correo', 'email'] },

  // CAT7 · Diseño y Multimedia
  { n: 'GIMP', cat: 'CAT7', que: 'Edición y retoque de fotos e imágenes, alternativa a Photoshop.', lic: 'GPL-3.0', repo: 'GNOME/gimp', url: 'https://www.gimp.org', alias: ['photoshop'] },
  { n: 'Inkscape', cat: 'CAT7', que: 'Diseño vectorial (SVG): logos, ilustraciones y diagramas.', lic: 'GPL-2.0', repo: null, url: 'https://inkscape.org', alias: ['illustrator'], aviso: 'Se desarrolla en GitLab; el espejo de GitHub está desactualizado desde 2022.' },
  { n: 'Krita', cat: 'CAT7', que: 'Pintura digital e ilustración, con pinceles y animación cuadro a cuadro.', lic: 'GPL-3.0', repo: 'KDE/krita', url: 'https://krita.org' },
  { n: 'MyPaint', cat: 'CAT7', que: 'Pintura y dibujo a mano alzada con lienzo infinito y tableta.', lic: 'GPL-2.0', repo: 'mypaint/mypaint', url: 'https://mypaint.app' },
  { n: 'Blender', cat: 'CAT7', que: 'Suite 3D completa: modelado, animación, render, efectos y edición de video.', lic: 'GPL-3.0', repo: 'blender/blender', url: 'https://www.blender.org', alias: ['3d'] },
  { n: 'ArtCraft', cat: 'CAT7', que: 'Estudio de creación con IA para artistas: compone en 2D, monta escenas en 3D y genera imágenes y video.', lic: 'Apache-2.0', repo: 'storytold/artcraft', url: 'https://getartcraft.com', alias: ['art craft'], aviso: 'Depende de modelos de IA; revisa cuáles corren en tu equipo y cuáles son servicios externos.' },
  { n: 'ComfyUI', cat: 'CAT7', que: 'Generación de imágenes y video con IA mediante un editor de nodos.', lic: 'GPL-3.0', repo: 'Comfy-Org/ComfyUI', url: 'https://www.comfy.org', alias: ['comfy', 'stable diffusion'] },
  { n: 'Stable Diffusion WebUI', cat: 'CAT7', que: 'Interfaz web para generar imágenes con modelos Stable Diffusion.', lic: 'AGPL-3.0', repo: 'AUTOMATIC1111/stable-diffusion-webui', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui', alias: ['automatic1111', 'a1111'] },
  { n: 'Kdenlive', cat: 'CAT7', que: 'Edición de video no lineal con efectos y transiciones.', lic: 'GPL-3.0', repo: 'KDE/kdenlive', url: 'https://kdenlive.org' },
  { n: 'Shotcut', cat: 'CAT7', que: 'Editor de video multiplataforma, sencillo y con muchos formatos.', lic: 'GPL-3.0', repo: 'mltframework/shotcut', url: 'https://shotcut.org' },
  { n: 'OBS Studio', cat: 'CAT7', que: 'Grabación de pantalla y transmisión en vivo.', lic: 'GPL-2.0', repo: 'obsproject/obs-studio', url: 'https://obsproject.com', alias: ['obs'] },
  { n: 'Natron', cat: 'CAT7', que: 'Composición de video y efectos visuales por nodos.', lic: 'GPL-2.0', repo: 'NatronGitHub/Natron', url: 'https://natrongithub.github.io' },
  { n: 'Synfig Studio', cat: 'CAT7', que: 'Animación 2D vectorial con interpolación automática.', lic: 'GPL-3.0', repo: 'synfig/synfig', url: 'https://www.synfig.org', alias: ['synfig'] },
  { n: 'Pencil2D', cat: 'CAT7', que: 'Animación 2D dibujada a mano, simple e intuitiva.', lic: 'GPL-2.0', repo: 'pencil2d/pencil', url: 'https://www.pencil2d.org' },
  { n: 'HandBrake', cat: 'CAT7', que: 'Convierte y comprime video a formatos comunes.', lic: 'GPL-2.0', repo: 'HandBrake/HandBrake', url: 'https://handbrake.fr' },
  { n: 'Audacity', cat: 'CAT7', que: 'Grabación y edición de audio.', lic: 'GPL-3.0', repo: 'audacity/audacity', url: 'https://www.audacityteam.org' },
  { n: 'Ardour', cat: 'CAT7', que: 'Estación de audio digital para grabar, mezclar y masterizar.', lic: 'GPL-2.0', repo: 'Ardour/ardour', url: 'https://ardour.org' },
  { n: 'LMMS', cat: 'CAT7', que: 'Producción musical con secuenciador, sintetizadores y muestras.', lic: 'GPL-2.0', repo: 'LMMS/lmms', url: 'https://lmms.io' },
  { n: 'darktable', cat: 'CAT7', que: 'Revelado de fotos RAW y gestión de la fototeca.', lic: 'GPL-3.0', repo: 'darktable-org/darktable', url: 'https://www.darktable.org', alias: ['lightroom'] },
  { n: 'RawTherapee', cat: 'CAT7', que: 'Procesamiento de fotos RAW con control fino del color.', lic: 'GPL-3.0', repo: 'RawTherapee/RawTherapee', url: 'https://rawtherapee.com' },
  { n: 'Scribus', cat: 'CAT7', que: 'Maquetación de revistas, folletos y publicaciones para imprenta.', lic: 'GPL-2.0', repo: 'scribusproject/scribus', url: 'https://www.scribus.net', alias: ['indesign'] },
  { n: 'Penpot', cat: 'CAT7', que: 'Diseño de interfaces y prototipos en el navegador, alternativa a Figma.', lic: 'MPL-2.0', repo: 'penpot/penpot', url: 'https://penpot.app', alias: ['figma'] },
  { n: 'FreeCAD', cat: 'CAT7', que: 'Modelado 3D paramétrico para ingeniería y diseño de piezas (CAD).', lic: 'LGPL-2.1', repo: 'FreeCAD/FreeCAD', url: 'https://www.freecad.org', alias: ['cad'] },
  { n: 'Godot', cat: 'CAT7', que: 'Motor para crear videojuegos 2D y 3D.', lic: 'MIT', repo: 'godotengine/godot', url: 'https://godotengine.org', alias: ['godot engine'] },
  { n: 'Excalidraw', cat: 'CAT7', que: 'Pizarra virtual para bocetos y diagramas con aspecto dibujado a mano.', lic: 'MIT', repo: 'excalidraw/excalidraw', url: 'https://excalidraw.com' },
  { n: 'draw.io', cat: 'CAT7', que: 'Editor de diagramas: flujos, redes, organigramas y UML.', lic: 'Apache-2.0', repo: 'jgraph/drawio', url: 'https://www.drawio.com', alias: ['drawio', 'diagrams.net'] },

  // CAT8 · Bases de Datos y Análisis
  { n: 'PostgreSQL', cat: 'CAT8', que: 'Base de datos relacional robusta y extensible.', lic: 'PostgreSQL License', repo: 'postgres/postgres', url: 'https://www.postgresql.org', alias: ['postgres'] },
  { n: 'MariaDB', cat: 'CAT8', que: 'Base de datos relacional compatible con MySQL, mantenida por su comunidad.', lic: 'GPL-2.0', repo: 'MariaDB/server', url: 'https://mariadb.org' },
  { n: 'MySQL Community', cat: 'CAT8', que: 'Base de datos relacional muy usada en aplicaciones web.', lic: 'GPL-2.0', repo: 'mysql/mysql-server', url: 'https://www.mysql.com', alias: ['mysql'] },
  { n: 'SQLite', cat: 'CAT8', que: 'Base de datos en un solo archivo, sin servidor, para apps y prototipos.', lic: 'Dominio público', repo: 'sqlite/sqlite', url: 'https://sqlite.org' },
  { n: 'DuckDB', cat: 'CAT8', que: 'Base de datos analítica embebida para consultar datos grandes con SQL.', lic: 'MIT', repo: 'duckdb/duckdb', url: 'https://duckdb.org' },
  { n: 'Valkey', cat: 'CAT8', que: 'Base de datos en memoria clave-valor para caché y colas, derivada de Redis.', lic: 'BSD-3-Clause', repo: 'valkey-io/valkey', url: 'https://valkey.io', alias: ['redis'] },
  { n: 'OpenSearch', cat: 'CAT8', que: 'Motor de búsqueda y análisis de registros, derivado de Elasticsearch.', lic: 'Apache-2.0', repo: 'opensearch-project/OpenSearch', url: 'https://opensearch.org', alias: ['elasticsearch'] },
  { n: 'DBeaver', cat: 'CAT8', que: 'Cliente universal de bases de datos para consultar y administrar con SQL.', lic: 'Apache-2.0', repo: 'dbeaver/dbeaver', url: 'https://dbeaver.io' },
  { n: 'pgAdmin', cat: 'CAT8', que: 'Administración gráfica de bases de datos PostgreSQL.', lic: 'PostgreSQL License', repo: 'pgadmin-org/pgadmin4', url: 'https://www.pgadmin.org', alias: ['pgadmin4'] },
  { n: 'Metabase', cat: 'CAT8', que: 'Inteligencia de negocios: preguntas a los datos y tableros sin programar.', lic: 'AGPL-3.0 (con partes de pago)', repo: 'metabase/metabase', url: 'https://www.metabase.com', alias: ['bi', 'power bi'] },
  { n: 'Apache Superset', cat: 'CAT8', que: 'Exploración de datos y tableros de inteligencia de negocios.', lic: 'Apache-2.0', repo: 'apache/superset', url: 'https://superset.apache.org', alias: ['superset'] },
  { n: 'Apache Airflow', cat: 'CAT8', que: 'Programa y vigila flujos de datos (ETL) escritos en Python.', lic: 'Apache-2.0', repo: 'apache/airflow', url: 'https://airflow.apache.org', alias: ['airflow', 'etl'] },
  { n: 'JupyterLab', cat: 'CAT8', que: 'Cuadernos interactivos para analizar datos con código, gráficas y texto.', lic: 'BSD-3-Clause', repo: 'jupyterlab/jupyterlab', url: 'https://jupyter.org', alias: ['jupyter'] },
  { n: 'R', cat: 'CAT8', que: 'Lenguaje y entorno para estadística y gráficos.', lic: 'GPL-2.0', repo: 'wch/r-source', url: 'https://www.r-project.org', alias: ['r project', 'rstats'] },
  { n: 'Orange', cat: 'CAT8', que: 'Minería de datos y aprendizaje automático visual, arrastrando bloques.', lic: 'GPL-3.0', repo: 'biolab/orange3', url: 'https://orangedatamining.com', alias: ['orange3'] },
  { n: 'QGIS', cat: 'CAT8', que: 'Sistema de información geográfica: mapas y análisis espacial.', lic: 'GPL-2.0', repo: 'qgis/QGIS', url: 'https://qgis.org', alias: ['gis', 'arcgis'] },

  // CAT9 · Finanzas y Contabilidad
  { n: 'Odoo Community', cat: 'CAT9', que: 'ERP modular: contabilidad, ventas, inventario, nómina y más.', lic: 'LGPL-3.0', repo: 'odoo/odoo', url: 'https://www.odoo.com', alias: ['odoo', 'erp'], aviso: 'Varios módulos (por ejemplo, parte de contabilidad y RR. HH.) solo existen en la edición de pago.', s: 1 },
  { n: 'ERPNext', cat: 'CAT9', que: 'ERP completo: contabilidad, compras, inventario, manufactura y proyectos.', lic: 'GPL-3.0', repo: 'frappe/erpnext', url: 'https://erpnext.com', s: 1 },
  { n: 'Dolibarr', cat: 'CAT9', que: 'ERP y CRM para pymes: facturas, contabilidad, inventario y clientes.', lic: 'GPL-3.0', repo: 'Dolibarr/dolibarr', url: 'https://www.dolibarr.org', s: 1 },
  { n: 'iDempiere', cat: 'CAT9', que: 'ERP empresarial con contabilidad, compras, ventas y producción.', lic: 'GPL-2.0', repo: 'idempiere/idempiere', url: 'https://www.idempiere.org' },
  { n: 'GnuCash', cat: 'CAT9', que: 'Contabilidad de partida doble para personas y pequeños negocios.', lic: 'GPL-2.0', repo: 'Gnucash/gnucash', url: 'https://www.gnucash.org' },
  { n: 'KMyMoney', cat: 'CAT9', que: 'Finanzas personales: cuentas, presupuestos e informes.', lic: 'GPL-2.0', repo: 'KDE/kmymoney', url: 'https://kmymoney.org' },
  { n: 'Firefly III', cat: 'CAT9', que: 'Gestor de finanzas personales con presupuestos y reglas automáticas.', lic: 'AGPL-3.0', repo: 'firefly-iii/firefly-iii', url: 'https://www.firefly-iii.org', alias: ['firefly'] },
  { n: 'Actual Budget', cat: 'CAT9', que: 'Presupuesto personal por sobres, local primero y con sincronización.', lic: 'MIT', repo: 'actualbudget/actual', url: 'https://actualbudget.org', alias: ['actual'] },
  { n: 'OrangeHRM', cat: 'CAT9', que: 'Recursos humanos: empleados, vacaciones, desempeño y contratación.', lic: 'GPL-3.0', repo: 'orangehrm/orangehrm', url: 'https://www.orangehrm.com', alias: ['recursos humanos', 'rrhh'], s: 1 },
  { n: 'Frappe HR', cat: 'CAT9', que: 'Recursos humanos y nómina: asistencia, permisos, gastos y pagos.', lic: 'GPL-3.0', repo: 'frappe/hrms', url: 'https://frappe.io/hr', alias: ['nomina', 'hrms'] },

  // CAT10 · Comercio Electrónico y CRM
  { n: 'WooCommerce', cat: 'CAT10', que: 'Tienda en línea sobre WordPress.', lic: 'GPL-3.0', repo: 'woocommerce/woocommerce', url: 'https://woocommerce.com', alias: ['tienda'] },
  { n: 'PrestaShop', cat: 'CAT10', que: 'Plataforma de tienda en línea con catálogo, pagos y envíos.', lic: 'OSL-3.0', repo: 'PrestaShop/PrestaShop', url: 'https://prestashop.com' },
  { n: 'Magento Open Source', cat: 'CAT10', que: 'Comercio electrónico para catálogos grandes y varias tiendas.', lic: 'OSL-3.0', repo: 'magento/magento2', url: 'https://business.adobe.com/products/magento/open-source.html', alias: ['magento'] },
  { n: 'OpenCart', cat: 'CAT10', que: 'Carrito de compras en PHP, sencillo de instalar.', lic: 'GPL-3.0', repo: 'opencart/opencart', url: 'https://www.opencart.com' },
  { n: 'Sylius', cat: 'CAT10', que: 'Comercio electrónico a medida sobre Symfony, sin cabeza (API).', lic: 'MIT', repo: 'Sylius/Sylius', url: 'https://sylius.com' },
  { n: 'Saleor', cat: 'CAT10', que: 'Comercio electrónico sin cabeza con API GraphQL.', lic: 'BSD-3-Clause', repo: 'saleor/saleor', url: 'https://saleor.io' },
  { n: 'Medusa', cat: 'CAT10', que: 'Plataforma de comercio modular para tiendas a medida.', lic: 'MIT (con partes de pago)', repo: 'medusajs/medusa', url: 'https://medusajs.com', alias: ['medusajs'] },
  { n: 'SuiteCRM', cat: 'CAT10', que: 'CRM: clientes, oportunidades de venta, campañas y casos.', lic: 'AGPL-3.0', repo: 'SuiteCRM/SuiteCRM', url: 'https://suitecrm.com', alias: ['crm', 'salesforce'] },
  { n: 'EspoCRM', cat: 'CAT10', que: 'CRM liviano y configurable para gestionar clientes y ventas.', lic: 'AGPL-3.0', repo: 'espocrm/espocrm', url: 'https://www.espocrm.com' },
  { n: 'Twenty', cat: 'CAT10', que: 'CRM moderno y personalizable, alternativa a Salesforce.', lic: 'AGPL-3.0 (con partes de pago)', repo: 'twentyhq/twenty', url: 'https://twenty.com' },
  { n: 'Krayin CRM', cat: 'CAT10', que: 'CRM sobre Laravel para pymes: contactos, embudo y correos.', lic: 'MIT', repo: 'krayin/laravel-crm', url: 'https://krayincrm.com', alias: ['krayin'] },
  { n: 'Mautic', cat: 'CAT10', que: 'Automatización de marketing: correos, campañas y seguimiento de contactos.', lic: 'GPL-3.0', repo: 'mautic/mautic', url: 'https://www.mautic.org', alias: ['marketing'] },
  { n: 'Chatwoot', cat: 'CAT10', que: 'Atención al cliente omnicanal: chat web, correo y redes en una bandeja.', lic: 'MIT (con partes de pago)', repo: 'chatwoot/chatwoot', url: 'https://www.chatwoot.com' },
  { n: 'osTicket', cat: 'CAT10', que: 'Mesa de ayuda con tickets para atender solicitudes y soporte.', lic: 'GPL-2.0', repo: 'osTicket/osTicket', url: 'https://osticket.com', alias: ['help desk', 'tickets'], s: 1 },
  { n: 'Zammad', cat: 'CAT10', que: 'Mesa de ayuda web: tickets por correo, chat, teléfono y redes.', lic: 'AGPL-3.0', repo: 'zammad/zammad', url: 'https://zammad.org', s: 1 },

  // CAT11 · Utilidades y Herramientas del Sistema
  { n: '7-Zip', cat: 'CAT11', que: 'Compresor de archivos con alta compresión (7z, zip y muchos más).', lic: 'LGPL-2.1 (con restricción unRAR)', repo: 'ip7z/7zip', url: 'https://www.7-zip.org', alias: ['7zip', 'winrar', 'zip'] },
  { n: 'PeaZip', cat: 'CAT11', que: 'Compresor y extractor de archivos con más de 200 formatos.', lic: 'LGPL-3.0', repo: 'peazip/PeaZip', url: 'https://peazip.github.io' },
  { n: 'VLC', cat: 'CAT11', que: 'Reproductor multimedia que abre casi cualquier formato de audio y video.', lic: 'GPL-2.0', repo: 'videolan/vlc', url: 'https://www.videolan.org', alias: ['vlc media player'] },
  { n: 'Firefox', cat: 'CAT11', que: 'Navegador web enfocado en la privacidad.', lic: 'MPL-2.0', repo: 'mozilla-firefox/firefox', url: 'https://www.firefox.com', alias: ['mozilla', 'navegador'] },
  { n: 'Notepad++', cat: 'CAT11', que: 'Editor de texto y código liviano para Windows.', lic: 'GPL-3.0', repo: 'notepad-plus-plus/notepad-plus-plus', url: 'https://notepad-plus-plus.org', alias: ['notepad'] },
  { n: 'PowerToys', cat: 'CAT11', que: 'Utilidades para Windows: ventanas, atajos, renombrado masivo y más.', lic: 'MIT', repo: 'microsoft/PowerToys', url: 'https://learn.microsoft.com/windows/powertoys/' },
  { n: 'Flameshot', cat: 'CAT11', que: 'Capturas de pantalla con anotaciones rápidas.', lic: 'GPL-3.0', repo: 'flameshot-org/flameshot', url: 'https://flameshot.org' },
  { n: 'BleachBit', cat: 'CAT11', que: 'Libera espacio y borra rastros: limpia cachés y archivos temporales.', lic: 'GPL-3.0', repo: 'bleachbit/bleachbit', url: 'https://www.bleachbit.org', alias: ['ccleaner'] },
  { n: 'Rufus', cat: 'CAT11', que: 'Crea memorias USB de arranque para instalar sistemas operativos.', lic: 'GPL-3.0', repo: 'pbatard/rufus', url: 'https://rufus.ie' },
  { n: 'Ventoy', cat: 'CAT11', que: 'USB de arranque con varias imágenes ISO a la vez: copiar y arrancar.', lic: 'GPL-3.0', repo: 'ventoy/Ventoy', url: 'https://www.ventoy.net' },
  { n: 'Syncthing', cat: 'CAT11', que: 'Sincroniza carpetas entre equipos sin pasar por la nube.', lic: 'MPL-2.0', repo: 'syncthing/syncthing', url: 'https://syncthing.net' },
  { n: 'Rclone', cat: 'CAT11', que: 'Copia y sincroniza archivos con decenas de nubes (Drive, S3, OneDrive…).', lic: 'MIT', repo: 'rclone/rclone', url: 'https://rclone.org' },
  { n: 'Timeshift', cat: 'CAT11', que: 'Puntos de restauración del sistema en Linux.', lic: 'GPL-2.0', repo: 'linuxmint/timeshift', url: 'https://github.com/linuxmint/timeshift' },
  { n: 'Glances', cat: 'CAT11', que: 'Monitor del sistema en terminal o web: CPU, memoria, discos y red.', lic: 'LGPL-3.0', repo: 'nicolargo/glances', url: 'https://nicolargo.github.io/glances/' },
];

/** Minúsculas, sin tildes y con un solo espacio entre palabras (solo letras y números). */
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const empiezaPalabra = (texto, q) => texto.startsWith(q) || texto.includes(` ${q}`);
const compacto = (s) => s.replace(/ /g, '');

/** Puntaje de una entrada para una consulta ya normalizada (0 = no coincide). */
export function puntuarEntrada(entrada, q) {
  if (!q) return 0;
  const nombre = normalizar(entrada.n);
  const alias = (entrada.alias ?? []).map(normalizar);
  const repo = normalizar(entrada.repo ?? '');
  const que = normalizar(entrada.que);
  if (nombre === q || compacto(nombre) === compacto(q)) return 100;
  if (alias.includes(q)) return 85;
  if (nombre.startsWith(q) || compacto(nombre).startsWith(compacto(q))) return 80;
  if (empiezaPalabra(nombre, q)) return 65;
  if (alias.some((a) => empiezaPalabra(a, q))) return 55;
  if (nombre.includes(q)) return 45;
  if (q.length >= 3 && empiezaPalabra(repo, q)) return 35;
  if (q.length >= 3 && q.split(' ').every((p) => empiezaPalabra(que, p))) return 20;
  return 0;
}

/** Entradas del catálogo que coinciden con la consulta, de la más a la menos parecida. */
export function filtrarCatalogo(consulta, catalogo = CATALOGO, limite = 6) {
  const q = normalizar(consulta);
  if (!q) return [];
  return catalogo
    .map((e) => ({ e, p: puntuarEntrada(e, q) }))
    .filter((x) => x.p > 0)
    .sort((a, b) => b.p - a.p || a.e.n.localeCompare(b.e.n, 'es'))
    .slice(0, limite)
    .map((x) => x.e);
}

/** Entrada del catálogo con ese repositorio de GitHub (sin distinguir mayúsculas), o null. */
export function buscarPorRepo(repo, catalogo = CATALOGO) {
  if (!repo) return null;
  const r = repo.toLowerCase();
  return catalogo.find((e) => e.repo && e.repo.toLowerCase() === r) ?? null;
}

/**
 * Palabras clave (en inglés y español, ya normalizadas) que sugieren una categoría
 * para un proyecto que no está en el catálogo. Coinciden al inicio de una palabra
 * («design» cuenta en «designers»); las de 3 letras o menos, solo como palabra entera. Lista hecha aquí, no viene de la investigación.
 */
export const PALABRAS_CATEGORIA = {
  CAT1: ['office', 'ofimatica', 'document', 'documento', 'spreadsheet', 'hoja de calculo', 'pdf', 'note', 'notas', 'ebook', 'word processor', 'presentation', 'productivity', 'productividad', 'calendar', 'bibliograph', 'citation'],
  CAT2: ['education', 'educa', 'learning', 'aprendizaje', 'lms', 'course', 'curso', 'school', 'escuela', 'teach', 'student', 'estudiante', 'flashcard', 'quiz', 'mooc', 'classroom'],
  CAT3: ['security', 'seguridad', 'password', 'contrasena', 'encrypt', 'cifrado', 'firewall', 'vpn', 'intrusion', 'siem', 'antivirus', 'malware', 'vulnerab', 'pentest', 'authentication', 'autenticacion', 'identity', 'sso', 'oauth', 'backup', 'respaldo', 'privacy', 'privacidad'],
  CAT4: ['server', 'servidor', 'infrastructure', 'infraestructura', 'container', 'contenedor', 'kubernetes', 'docker', 'monitoring', 'monitoreo', 'observability', 'devops', 'virtualization', 'virtualizacion', 'network', 'dns', 'proxy', 'load balanc', 'storage', 'almacenamiento', 'self hosted', 'selfhosted', 'cloud native', 'deploy'],
  CAT5: ['ide', 'code editor', 'editor de codigo', 'git', 'version control', 'project management', 'gestion de proyectos', 'kanban', 'scrum', 'issue tracker', 'ci cd', 'continuous integration', 'developer', 'desarrollador', 'programming', 'programacion', 'compiler', 'debugger', 'sdk'],
  CAT6: ['chat', 'messag', 'mensaje', 'video conferenc', 'videoconferencia', 'videollamada', 'collaboration', 'colaboracion', 'email', 'correo', 'mail', 'wiki', 'forum', 'foro', 'communication', 'comunicacion', 'meeting', 'reunion', 'matrix', 'xmpp', 'intranet'],
  CAT7: ['image', 'imagen', 'photo', 'foto', 'video', 'audio', 'music', 'musica', '3d', 'design', 'diseno', 'graphic', 'grafico', 'animation', 'animacion', 'drawing', 'dibujo', 'paint', 'pintura', 'render', 'game engine', 'videojuego', 'diffusion', 'artist', 'artista', 'film', 'cine', 'creative', 'cad', 'diagram', 'illustrat', 'multimedia'],
  CAT8: ['database', 'base de datos', 'sql', 'analytics', 'analitica', 'data', 'datos', 'business intelligence', 'dashboard', 'etl', 'notebook', 'statistic', 'estadistica', 'gis', 'search engine', 'olap', 'machine learning', 'data science'],
  CAT9: ['accounting', 'contabilidad', 'contable', 'finance', 'financ', 'invoice', 'factura', 'erp', 'budget', 'presupuesto', 'payroll', 'nomina', 'hrm', 'human resources', 'recursos humanos', 'bookkeeping', 'expense', 'gasto'],
  CAT10: ['ecommerce', 'e commerce', 'commerce', 'comercio', 'shop', 'tienda', 'store', 'cart', 'carrito', 'crm', 'marketing', 'helpdesk', 'help desk', 'customer support', 'ticket', 'sales', 'ventas', 'pos', 'point of sale', 'punto de venta'],
  CAT11: ['utility', 'utilidad', 'cli', 'command line', 'terminal', 'file manager', 'compress', 'zip', 'usb', 'sync', 'sincroniza', 'screenshot', 'captura', 'clipboard', 'disk', 'disco', 'cleaner', 'media player', 'reproductor', 'browser', 'navegador', 'system monitor', 'launcher'],
};

/**
 * Sugiere una categoría para un proyecto a partir de su nombre, descripción y temas
 * de GitHub. Los temas valen doble. Devuelve { id, coincidencias } o null si nada encaja.
 */
export function sugerirCategoria({ nombre = '', descripcion = '', temas = [] } = {}, palabras = PALABRAS_CATEGORIA) {
  const texto = ` ${normalizar(`${nombre} ${descripcion}`)} `;
  const textoTemas = ` ${normalizar(temas.join(' ').replace(/-/g, ' '))} `;
  let mejor = null;
  for (const [id, lista] of Object.entries(palabras)) {
    let puntos = 0;
    const coincidencias = [];
    for (const p of lista) {
      // Las claves cortas (3 letras o menos: «ide», «git», «cad») deben ser palabra entera.
      const clave = p.length <= 3 ? ` ${p} ` : ` ${p}`;
      const enTexto = texto.includes(clave);
      const enTemas = textoTemas.includes(clave);
      if (enTexto || enTemas) {
        puntos += (enTexto ? 1 : 0) + (enTemas ? 2 : 0);
        coincidencias.push(p.trim());
      }
    }
    if (puntos > 0 && (!mejor || puntos > mejor.puntos)) mejor = { id, puntos, coincidencias };
  }
  return mejor ? { id: mejor.id, coincidencias: mejor.coincidencias } : null;
}
