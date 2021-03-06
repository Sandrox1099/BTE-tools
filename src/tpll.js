/* global importPackage Packages player context argv Vector */
const getProjection = require('./modules/getProjection')

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)

const usage = `<latitude> <longitude> [altitude]
 • §o/cs tpll 47.58523 6.89725
 • §o/cs tpll 47.58523, 6.89725 370
 • §o/cs tpll 47°35'6.32"N 6°53'50.06"E
 • §o/cs tpll 47°35'6.32"N, 6°53'50.06"E 370`

context.checkArgs(2, 3, usage)

player.print('§7§oTeleportation...')

const projection = getProjection()

argv[1].replace(',', '')
argv[2].replace(',', '')

if ((argv[1] + '').match(new RegExp('\\d*°\\d*\'\\d*.\\d*"')) && (argv[2] + '').match(new RegExp('\\d*°\\d*\'\\d*.\\d*"'))) {
  argv[1] = dmsToll(argv[1])
  argv[2] = dmsToll(argv[2])
  teleport()
} else if ((argv[1] + '').match(new RegExp('\\d*')) && (argv[2] + '').match(new RegExp('\\d*'))) {
  teleport()
} else {
  player.printError('Wrong usage')
  player.printError(usage)
}

function teleport () {
  const [x, z] = projection.fromGeo(Number.parseFloat(argv[2]), Number.parseFloat(argv[1]))

  let pos

  if (argv[3]) {
    pos = new Vector(x, Number.parseFloat(argv[3]) - 2, z)
  } else {
    pos = new Vector(x, player.getLocation().y, z)

    const blocks = context.remember()

    while (blocks.getBlock(pos.add(new Vector(0, 1, 0))).id !== context.getBlock('air').id) {
      pos = pos.add(new Vector(0, 1, 0))
    }
    while (blocks.getBlock(pos).id === context.getBlock('air').id) {
      pos = pos.add(new Vector(0, -1, 0))
    }
  }

  player.setPosition(pos.add(new Vector(0, 2, 0)))
  player.print(`Teleported to ${pos.x} ${pos.y} ${pos.z}`)
}

function dmsToll (dms) {
  dms = '' + dms
  const [degrees, minutes, seconds] = dms.split(new RegExp('°|\\\'|\\"'))
  return Number.parseFloat(degrees) + Number.parseFloat(minutes) / 60 + Number.parseFloat(seconds) / 3600
}
