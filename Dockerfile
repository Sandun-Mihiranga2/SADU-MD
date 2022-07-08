
FROM aquabotwa/sanuwa-official:beta 

RUN git clone https://github.com/Sandun-Mihiranga2/SADU-MD /root/queendiana
WORKDIR /root/queendiana/
ENV TZ=Europe/Istanbul
RUN yarn add supervisor -g
RUN yarn install --no-audit

CMD ["node", "bot.js"]
