#!/usr/bin/env sh

BASE="$(cd "$(dirname "$_")"; pwd)"
PLATFORM=$(uname | tr '[A-Z]' '[a-z]')
ARCH=$(getconf LONG_BIT)
NODE_DIR="$HOME/.node"
NODE_VERSION="6.5.0"

print_help()
{
    IFS='%'
    echo "Usage: ./node-install.sh [options...]
 -i, --install     Install node
 -u, --uninstall   Uninstall node"
    unset IFS
}

if [ $# -eq 0 ]; then
    print_help
    exit 1
fi

for var in "$@"
do
    case $var in
        "--install" | "-i")
            UNINSTALL=false
            ;;
        "--uninstall" | "-u")
            UNINSTALL=true
            ;;
        *)
    esac
done

if [ -z "$UNINSTALL" ]; then
    echo "node-install: install or uninstall flag must be set."
    echo
    print_help
    exit 1
fi

unset IFS

log ()
{
    printf ":: $1\n"
}

install ()
{
    export N_PREFIX=$HOME/.node
    export PATH=$N_PREFIX/bin:$PATH

    log "INSTALLING NODE..."
    mkdir -p $N_PREFIX/bin
    curl -o $N_PREFIX/bin/n https://raw.githubusercontent.com/visionmedia/n/master/bin/n
    chmod +x $N_PREFIX/bin/n
    n "v$NODE_VERSION"

    log "INSTALLING GLOBAL DEPENDENCIES..."
    rm -rf node_modules
    npm cache clean
    npm install --global gulp-cli
    log 'OK'

    printf '=============================================================\n'
    printf 'YOU ARE NOT DONE YET!\n'
    printf '\n'
    printf '1. Look for a hidden file in your home directory called .profile or\n'
    printf '   .bash_profile.\n'
    printf '2. Open the .profile or .bash_profile file in an editor. Append the\n'
    printf '   following lines to the bottom:\n'
    printf '   export N_PREFIX=$HOME/.node\n'
    printf '   export PATH=$N_PREFIX/bin:$PATH\n'
    printf '3. Ensure you have the correct version of node:\n'
    printf '   node --version\n'
    printf '=============================================================\n\n'
}

uninstall ()
{
    log "UNINSTALLING LOCAL NODE..."
    rm -rf "$NODE_DIR"
	log 'OK'
}

# argument logic
if [ "$UNINSTALL" = false ]; then
    install
elif [ "$UNINSTALL" = true ]; then
    uninstall
fi

log 'DONE'
