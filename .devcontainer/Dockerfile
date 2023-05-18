ARG VARIANT=18-bullseye
ARG FLAVOUR=typescript
FROM mcr.microsoft.com/vscode/devcontainers/${FLAVOUR}-node:0-${VARIANT}

# [Optional] Install Homebrew (will not work on M1 Macs)
#RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install additional OS packages.
RUN apt-get update && \
  export DEBIAN_FRONTEND=noninteractive && \
  apt-get -y install --no-install-recommends \
    python3-pip \
    python3-venv \
    inetutils-ping \
    vim \
    bc

# [Optional] Install an additional version of node using nvm.
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# Set zsh as the default shell.
RUN chsh -s /bin/zsh root && \
  chsh -s /bin/zsh node

# [Optional] install and enable useful ZSH plugins
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting && \
  git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions && \
  git clone https://github.com/MichaelAquilina/zsh-you-should-use.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/you-should-use
RUN sed -i "s/^plugins=(git)/plugins=(git docker you-should-use zsh-autosuggestions zsh-syntax-highlighting)/" ${HOME}/.zshrc

# [Optional] Install yarn.
RUN npm install -g yarn

RUN yarn set version stable

RUN corepack enable
RUN corepack prepare yarn@stable --activate

# [Optional] Install the AWS CLI v2.
# RUN curl -s "https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip" -o "awscliv2-$(uname -m).zip" && \
#   unzip -qq "awscliv2-$(uname -m).zip" && \
#   ./aws/install && \
#   rm -rf ./aws "awscliv2-$(uname -m).zip"

# Install Supabase CLI.
RUN wget -q -O /tmp/supabase.deb https://github.com/supabase/cli/releases/download/v1.52.3/supabase_1.52.3_linux_$(dpkg --print-architecture).deb \
  && dpkg -i /tmp/supabase.deb \
  && rm /tmp/supabase.deb

WORKDIR /workspace
